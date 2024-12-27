// MVVM 框架实现 (使用 Proxy 改进版本)
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
  
  class Dep {
    static deps = new Map();
  
    static depend(key) {
      if (!Dep.deps.has(key)) {
        Dep.deps.set(key, []);
      }
      const subs = Dep.deps.get(key);
      if (Dep.target && !subs.includes(Dep.target)) {
        subs.push(Dep.target);
      }
    }
  
    static notify(key) {
      const subs = Dep.deps.get(key);
      if (subs) {
        subs.forEach(sub => sub.update());
      }
    }
  }
  
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
  
  class Compiler {
    constructor(el, vm) {
      this.el = document.querySelector(el);
      this.vm = vm;
      this.compile(this.el);
    }
  
    compile(el) {
      const childNodes = el.childNodes;
      [...childNodes].forEach(node => {
        if (node.nodeType === 1) {
          // 元素节点
          this.compileElement(node);
          if (node.childNodes.length > 0) {
            this.compile(node);
          }
        } else if (node.nodeType === 3) {
          // 文本节点
          this.compileText(node);
        }
      });
    }
  
    compileElement(node) {
      const attrs = node.attributes;
      [...attrs].forEach(attr => {
        const attrName = attr.name;
        const attrValue = attr.value;
  
        if (attrName.startsWith('v-')) {
          const dir = attrName.substring(2);
          this[dir] && this[dir](node, attrValue);
        }
  
        if (attrName === 'v-model') {
          node.addEventListener('input', e => {
            this.vm[attrValue] = e.target.value;
          });
        }
      });
    }
  
    compileText(node) {
      const reg = /{{(.+?)}}/g;
      const text = node.textContent;
  
      if (reg.test(text)) {
        const key = RegExp.$1.trim();
        node.textContent = text.replace(reg, this.vm[key]);
  
        new Watcher(this.vm, key, newValue => {
          node.textContent = newValue;
        });
      }
    }
  }
  
  class MVVM {
    constructor(options) {
      this.$el = options.el;
      this.$data = options.data;
  
      // 数据劫持
      this.$data = new Observer(this.$data);
  
      // 数据代理
      Object.keys(this.$data).forEach(key => {
        this.proxyData(key);
      });
  
      // 模板编译
      new Compiler(this.$el, this);
    }
  
    proxyData(key) {
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(newValue) {
          this.$data[key] = newValue;
        }
      });
    }
  }