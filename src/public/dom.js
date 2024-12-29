// Observer: 数据劫持
class Observer {
    constructor(data) {
        return this.observe(data);
    }

    observe(data) {
        if (!data || typeof data !== 'object') return data;

        return new Proxy(data, {
            get: (target, key) => {
                Dep.target && Dep.depend(key);
                const value = target[key];
                return typeof value === 'object' ? this.observe(value) : value;
            },
            set: (target, key, value) => {
                if (target[key] !== value) {
                    target[key] = value;
                    Dep.notify(key);
                }
                return true;
            }
        });
    }
}

// Dep: 依赖管理
class Dep {
    static deps = new Map();

    static depend(key) {
        if (!Dep.deps.has(key)) Dep.deps.set(key, []);
        const subs = Dep.deps.get(key);
        if (Dep.target && !subs.includes(Dep.target)) subs.push(Dep.target);
    }

    static notify(key) {
        const subs = Dep.deps.get(key);
        if (subs) subs.forEach(sub => sub.update());
    }
}

// Watcher: 依赖订阅
class Watcher {
    constructor(vm, key, callback) {
        this.vm = vm;
        this.key = key;
        this.callback = callback;

        Dep.target = this;
        this.vm[this.key]; // 触发依赖收集
        Dep.target = null;
    }

    update() {
        const newValue = this.vm[this.key];
        this.callback(newValue);
    }
}

// 指令解析器
const Directives = {
    //{{}}
    text(node, vm, expression) {
        this.update(node, vm[expression]);
        new Watcher(vm, expression, value => this.update(node, value));
    },
    // v-model
    model(node, vm, expression) {

        //dom赋初值
        this.update(node, vm[expression]);


        node['beforeChanged'] = () => { return true };
        //dom-->vm
        node.addEventListener('input', e => { vm.dataChanged(expression, e.target) });
        //vm-->dom
        new Watcher(vm, expression, value => this.update(node, value));
    },
    //dom-->vm
    on(node, vm, expression, event) {
        const method = vm.$methods[expression];
        node.addEventListener(event, method.bind(vm));
    },

    update(node, value) {
        // 检查 node 是否为有效的 DOM 元素
        if (node && (node instanceof Node || 'nodeType' in node)) {
            // 对于有 value 属性的特定元素，如 input、textarea 等，设置 value
            if ('value' in node) {
                node.value = value;
            }
            if ('textContent' in node) {
                node.textContent = value;
            }
        }
    }
};
// v-if
Directives.if = function (node, vm, expression) {
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
};
/**
 * 支持动态绑定 class、style 属性
 * @param {*} node 
 * @param {*} vm 
 * @param {*} expression 
 * @param {*} attrName 
 */
Directives.bind = function (node, vm, expression, attrName) {
    if (attrName === 'class') {
        // 动态 class 处理（之前实现）
        const updateClass = value => {
            const staticClass = node.__staticClass || node.className || '';
            const dynamicClass = Array.isArray(value) ? value.join(' ') : value;
            node.className = `${staticClass} ${dynamicClass}`.trim();
        };
        if (!node.__staticClass) node.__staticClass = node.className;
        updateClass(vm[expression]);
        new Watcher(vm, expression, updateClass);

    } else if (attrName === 'style') {
        // 动态 style 处理
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

    } else {
        // 默认属性处理
        const updateAttr = value => {
            node.setAttribute(attrName, value);
        };
        updateAttr(vm[expression]);
        new Watcher(vm, expression, updateAttr);
    }
};


// Compiler: 模板编译器
class Compiler {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        this.compile(this.$el);
    }

    compile(el) {
        el.childNodes.forEach(node => {
            if (node.nodeType === 1) {
                // 元素节点
                this.compileElement(node);
                if (node.childNodes.length > 0) this.compile(node);
            } else if (node.nodeType === 3) {
                // 文本节点
                this.compileText(node);
            }
        });
    }

    compileElement(node) {
        [...node.attributes].forEach(attr => {
            const attrName = attr.name;
            const attrValue = attr.value;
            if (attrName.startsWith('@')) {
                const [dir, event] = attrName.substring(1).split(':');
                switch (dir) {
                    case 'if':
                        Directives.if(node, this.$vm, attrValue);
                        break;
                    case 'bind':
                        const attrKey = event;
                        Directives.bind(node, this.$vm, attrValue, attrKey);
                        break;
                    case 'on':
                        Directives.on(node, this.$vm, attrValue, event);
                        break;
                    case 'model':
                        Directives.model(node, this.$vm, attrValue, event);
                        break;
                    default:
                        try {
                            //语法糖 @click @input...
                            Directives.on(node, this.$vm, attrValue, !event ? dir : event);
                        } catch (error) {
                            console.log(`attrName:` + attrName, `attrValue:` + attrValue, `dir:` + dir, `event:` + event);
                            console.error(error)
                        }
                        break;
                }
            }

        });
    }

    compileText(node) {
        const reg = /{{(.+?)}}/g;
        const text = node.textContent;
        if (reg.test(text)) {
            const key = RegExp.$1.trim();
            Directives.text(node, this.$vm, key);
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

        // 数据劫持
        this.$data = new Observer(this.$data);

        // 数据代理
        Object.keys(this.$data).forEach(key => this.proxyData(key));

        // 计算属性
        this.initComputed();

        this.initMethods();

        // 模板编译
        new Compiler(this.$el, this);
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get: () => this.$data[key],
            set: value => this.$data[key] = value
        });
    }
    dataChanged(dataName, node) {
        this[dataName] = this.sanitizeHTML(node.value);
        if (typeof this[`${dataName}Changed`] === 'function') {
            this[`${dataName}Changed`](node.value);
        }
    }
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
    initComputed() {
        if (!this.$computed) return;

        Object.keys(this.$computed).forEach(key => {
            Object.defineProperty(this, key, {
                get: () => this.$computed[key].call(this)
            });
        });
    }
    // 新增方法：绑定 methods 上下文
    initMethods() {
        if (!this.$methods) return;
        Object.keys(this.$methods).forEach(method => {
            this[method] = this.$methods[method].bind(this);
        });
    }
}
