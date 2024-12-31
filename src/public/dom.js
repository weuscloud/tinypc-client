// Observer: 数据劫持
class DataObserver {
    constructor(data) {
        if (Array.isArray(data)) {
            return this.observeArray(data); // 对数组进行特殊处理
        } else {
            return this.observe(data); // 对对象进行普通处理
        }
    }

    // 观察对象的属性
    observe(data) {
        if (!data || typeof data !== 'object') return data;

        // 使用 Proxy 对象进行代理
        return new Proxy(data, {
            get: (target, key) => {
                if (Dep.target) {
                    Dep.depend(key); // 当访问属性时，收集依赖
                }
                const value = target[key];
                // 如果值是对象，则递归观察
                return typeof value === 'object' ? new DataObserver(value) : value;
            },
            set: (target, key, value) => {
                const oldValue = target[key];
                if (oldValue !== value) {
                    target[key] = value;
                    Dep.notify(key); // 通知视图更新
                }
                return true;
            }
        });
    }

    // 观察数组的方法，重写数组变异方法以便能够追踪变动
    observeArray(array) {
        const arrayProto = Array.prototype;
        const proto = Object.create(arrayProto);  // 创建新原型，继承 Array 原型
        const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

        methodsToPatch.forEach(method => {
            proto[method] = (...args) => {
                const result = arrayProto[method].apply(array, args); // 调用原数组方法
                args.forEach(arg => {
                    if (typeof arg === 'object') {
                        new DataObserver(arg); // 对新增的对象元素进行观察
                    }
                });
                Dep.notify('arrayUpdate'); // 数组更新通知
                return result;
            };
        });

        array.__proto__ = proto; // 将数组的原型指向新的 proto

        // 对已有数组元素进行递归观察
        array.forEach(item => {
            if (typeof item === 'object') {
                new DataObserver(item); // 对数组项进行递归观察
            }
        });

        return array;
    }
}

// Dep: 依赖管理
class Dep {
    static deps = new Map();

    // 收集依赖
    static depend(key) {
        if (!Dep.deps.has(key)) Dep.deps.set(key, []);
        const subs = Dep.deps.get(key);
        if (Dep.target && !subs.includes(Dep.target)) subs.push(Dep.target);
    }

    // 通知依赖更新
    static notify(key) {
        const subs = Dep.deps.get(key);
        if (subs) subs.forEach(sub => sub.update());
    }
}

// Watcher: 依赖订阅
class Watcher {
    constructor(vm, key, callback) {
        this.$vm = vm;
        this.key = key;
        this.callback = callback;

        Dep.target = this;
        this.$vm[this.key]; // 触发依赖收集
        Dep.target = null;
    }

    // 更新回调
    update() {
        const newValue = this.$vm[this.key];
        this.callback(newValue);
    }
}

// 指令处理抽象接口
class DirectiveHandler {
    constructor() {
        this.directives = {};
    }

    // 注册指令
    registerDirective(name, handler) {
        this.directives[name] = handler;
    }

    // 处理指令
    handle(node, vm, attrName, attrValue) {
        const [dir, event] = attrName.substring(1).split(':');
        const directive = this.directives[dir];
        if (directive) {
            directive.handle(node, vm, attrValue, event);
        } else {
            console.error(`不支持的指令: ${attrName}`);
        }
    }

    // 处理文本指令
    handleText(node, vm, key) {
        const directive = this.directives['text'];
        if (directive) {
            directive.handleText(node, vm, key);
        }
    }
}

// 文本指令
class TextDirective {
    handleText(node, vm, key) {
        const update = value => {
            if (node && ('textContent' in node)) {
                node.textContent = value;
            }
        };
        update(vm[key]);
        new Watcher(vm, key, update);
    }
}

// v-model 指令
class ModelDirective {
    handle(node, vm, expression) {
        // dom 赋初值
        this.update(node, vm[expression]);

        // dom-->vm
        node.addEventListener('input', e => { vm.dataChanged(expression, e.target) });
        // vm-->dom
        new Watcher(vm, expression, value => this.update(node, value));
    }

    update(node, value) {
        if (node && ('value' in node)) {
            node.value = value;
        }
    }
}

// 事件绑定指令
class OnDirective {
    handle(node, vm, expression, event) {
        const method = vm.$methods[expression];
        node.addEventListener(event, method.bind(vm));
    }
}

// click 指令
class ClickDirective {
    handle(node, vm, expression) {
        const onDirective = new OnDirective();
        onDirective.handle(node, vm, expression, 'click');
    }
}

// if 指令
class IfDirective {
    handle(node, vm, expression) {
        const parent = node.parentNode;
        const placeholder = document.createComment('@if'); // 注释占位
        let isRendered = false; // 标记当前节点渲染状态

        const updateView = value => {
            if (value) {
                if (!isRendered) {
                    parent.insertBefore(node, placeholder); // 插入 DOM
                    isRendered = true;
                }
            } else {
                if (isRendered) {
                    parent.replaceChild(placeholder, node); // 替换为注释
                    isRendered = false;
                }
            }
        };

        // 初始渲染
        updateView(vm[expression]);

        // 监听变化
        new Watcher(vm, expression, updateView);
    }
}

// 动态绑定 class 指令
class ClassDirective {
    handle(node, vm, expression) {
        const updateClass = value => {
            const staticClass = node.__staticClass || node.className || '';
            const dynamicClass = Array.isArray(value) ? value.join(' ') : value;
            node.className = `${staticClass} ${dynamicClass}`.trim();
        };
        if (!node.__staticClass) node.__staticClass = node.className;
        updateClass(vm[expression]);
        new Watcher(vm, expression, updateClass);
    }
}

// 动态绑定 style 指令
class StyleDirective {
    handle(node, vm, expression) {
        const updateStyle = value => {
            if (typeof value === 'string') {
                // 如果是字符串形式，直接赋值
                node.style.cssText = value;
            } else if (typeof value === 'object') {
                // 如果是对象形式，逐个赋值样式
                Object.keys(value).forEach(key => {
                    node.style[key] = value[key];
                });
            }
        };
        updateStyle(vm[expression]);
        new Watcher(vm, expression, updateStyle);
    }
}

// for 指令
class ForDirective {
    handle(node, vm, expression) {
        const [itemKey, indexKey, arrKey] = this.parseExpression(expression);
        const parent = node.parentNode;
        const placeholder = document.createComment('@for'); // 注释占位

        const update = () => {
            const dataArray = vm[arrKey];
            if (!Array.isArray(dataArray)) {
                console.error(`@for 指令绑定的数据 ${arrKey} 必须是一个数组`);
                return;
            }
            let nodeArr = [];
            let templateNode;

            // 删除上次渲染的元素
            const existingNodes = parent.querySelectorAll(`[data-for-index="${arrKey}"]`);
            existingNodes.forEach(existingNode => {
                parent.removeChild(existingNode);
            });

            if (node.__template) {
                // 从内存中获取模板
                templateNode = node.__template.cloneNode(true);
            } else {
                // 第一次渲染，保存模板到内存
                templateNode = node.cloneNode(true);
                node.__template = templateNode;
                parent.replaceChild(placeholder, node); // 替换为注释
            }

            for (let index = 0; index < dataArray.length; index++) {
                let cloneNode = templateNode.cloneNode(true);
                cloneNode.dataset.forIndex = arrKey; // 添加一个自定义属性，方便后续删除
                cloneNode.$index = index;//为元素添加一个$index属性
                nodeArr[index] = cloneNode;
                nodeArr[index].removeAttribute('@for');
                this.compileText(nodeArr[index], itemKey, dataArray[index]);
                if (typeof indexKey === 'string') {
                    this.compileText(nodeArr[index], indexKey, index);
                }
            }

            parent.append(...nodeArr);
        };

        update();
        // 监听数组变更
        new Watcher(vm, arrKey, update);
    }

    // 解析表达式: "num,index in numbers"
    parseExpression(expression) {
        const match = expression.match(/(\w+)(,\w+)?\s+in\s+(\w+)/);
        if (!match) {
            console.error(`@for 指令表达式格式错误: ${expression}`);
            return [];
        }
        return [match[1], match[2], match[3]];
    }

    compileText(node, key, value) {
        // 获取元素的innerHTML
        let innerHTML = node.innerHTML;
        // 使用正则表达式进行匹配和替换
        let regex = new RegExp('{{' + key + '}}', 'g');
        innerHTML = innerHTML.replace(regex, value);
        // 设置替换后的innerHTML
        node.innerHTML = innerHTML;
    }
}

// 通用绑定指令
class BindDirective {
    handle(node, vm, expression, attrName) {
        if (attrName === 'class') {
            const classDirective = new ClassDirective();
            classDirective.handle(node, vm, expression);
        } else if (attrName === 'style') {
            const styleDirective = new StyleDirective();
            styleDirective.handle(node, vm, expression);
        } else {
            const updateAttr = value => {
                node.setAttribute(attrName, value);
            };
            updateAttr(vm[expression]);
            new Watcher(vm, expression, updateAttr);
        }
    }
}

// 数据代理类
class DataProxy {
    constructor(vm, data) {
        this.$vm = vm;
        this.data = data;
        this.proxyData();
    }

    // 代理数据访问
    proxyData() {
        Object.keys(this.data).forEach(key => {
            Object.defineProperty(this.$vm, key, {
                get: () => this.data[key],
                set: value => this.data[key] = value
            });
        });
    }
}

// 计算属性处理类
class ComputedProperty {
    constructor(vm, computed) {
        this.$vm = vm;
        this.computed = computed;
        this.initComputed();
    }

    // 初始化计算属性
    initComputed() {
        if (!this.computed) return;

        Object.keys(this.computed).forEach(key => {
            Object.defineProperty(this.$vm, key, {
                get: () => this.computed[key].call(this.$vm)
            });
        });
    }
}

// 模板编译类
class TemplateCompiler {
    constructor(el, vm, directiveHandler) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el;
        this.$vm = vm;
        this.directiveHandler = directiveHandler;
        this.compile(this.$el);
    }

    // 编译模板
    compile(el) {
        const queue = [el];
        while (queue.length > 0) {
            const node = queue.shift();
            if (node.nodeType === 1) {
                this.compileElement(node);
                if (node.childNodes.length > 0) {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        queue.push(node.childNodes[i]);
                    }
                }
            } else if (node.nodeType === 3) {
                this.compileText(node);
            }
        }
    }

    // 编译元素节点
    compileElement(node) {
        [...node.attributes].forEach(attr => {
            const attrName = attr.name;
            const attrValue = attr.value;
            if (attrName.startsWith('@')) {
                this.directiveHandler.handle(node, this.$vm, attrName, attrValue);
            }
        });
    }

    // 编译文本节点
    compileText(node) {
        const reg = /{{(.+?)}}/g;
        const text = node.textContent;
        if (reg.test(text)) {
            const key = RegExp.$1.trim();
            this.directiveHandler.handleText(node, this.$vm, key);
        }
    }
}

// MVVM: 核心框架
class MVVM {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$methods = options.methods;
        this.$computed = options.computed;
        this.$sanitized = options.sanitized || 'true';
        // 数据劫持
        this.$data = new DataObserver(this.$data);

        // 数据代理
        new DataProxy(this, this.$data);

        // 计算属性
        new ComputedProperty(this, this.$computed);

        // 初始化方法
        this.initMethods();

        // 模板编译
        const directiveHandler = new DirectiveHandler();
        directiveHandler.registerDirective('text', new TextDirective());
        directiveHandler.registerDirective('model', new ModelDirective());
        directiveHandler.registerDirective('on', new OnDirective());
        directiveHandler.registerDirective('click', new ClickDirective());
        directiveHandler.registerDirective('if', new IfDirective());
        directiveHandler.registerDirective('class', new ClassDirective());
        directiveHandler.registerDirective('style', new StyleDirective());
        directiveHandler.registerDirective('bind', new BindDirective());
        directiveHandler.registerDirective('for', new ForDirective());

        this.$compiler = new TemplateCompiler(this.$el, this, directiveHandler);

        setTimeout(() => {
            if (typeof options.created === 'function') {
                options.created.call(this);
            }
        }, 100);
    }

    // 初始化方法
    initMethods() {
        if (!this.$methods) return;
        Object.keys(this.$methods).forEach(method => {
            this[method] = this.$methods[method].bind(this);
        });
    }

    // 数据变更处理
    dataChanged(dataName, node) {
        //变量命名中如果含有nosanitized则不进行安全处理
        if (typeof dataName === 'string' && dataName.includes('nosanitized')) {
            this[dataName] = node.value;
        } else {
            this[dataName] = this.sanitizeHTML(node.value);
        }
        if (typeof this[`${dataName}Changed`] === 'function') {
            this[`${dataName}Changed`](node.value);
        }
    }

    // HTML 转义
    sanitizeHTML(html) {
        // 定义要转义的字符
        const escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        // 定义要移除的危险标签
        const dangerousTags = ['script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'base', 'basefont', 'link', 'meta', 'form'];
        // 定义要移除的危险属性
        const dangerousAttributes = ['onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress', 'javascript:', 'vbscript:'];

        // 转义特殊字符
        let sanitized = html.replace(/[&<>"']/g, function (match) {
            return escapeChars[match];
        });

        // 移除危险标签
        dangerousTags.forEach(tag => {
            const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>|<${tag}[^/>]*?/>`, 'gi');
            sanitized = sanitized.replace(regex, '');
        });

        // 移除危险属性
        dangerousAttributes.forEach(attr => {
            const regex = new RegExp(` ${attr}=[^>]*`, 'gi');
            sanitized = sanitized.replace(regex, '');
        });

        return sanitized;
    }
}