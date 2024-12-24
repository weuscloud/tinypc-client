const Base = require('./Base');
class MessageCenter extends Base {
    constructor() {
        if (MessageCenter.instance) {
            return MessageCenter.instance;
        }
        super();
        this.subscribers = {};
        MessageCenter.instance = this;
    }

    // 订阅方法
    addListener(topic, callback) {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        this.subscribers[topic].push(callback);
    }

    // 发布方法，支持多个参数
    sendMessage(topic, ...args) {
        const callbacks = this.subscribers[topic];
        if (!callbacks || callbacks.length === 0) return;
        callbacks.forEach(callback => {
            callback(...args);
        });
    }

    // 取消订阅方法，根据主题和具体回调函数移除订阅关系
    removeListener(topic, callback) {
        const callbacks = this.subscribers[topic];
        if (callbacks) {
            this.subscribers[topic] = callbacks.filter(cb => cb !== callback);
            if (this.subscribers[topic].length === 0) {
                delete this.subscribers[topic];
            }
        }
    }

    // 静态方法，获取单例实例
    static getInstance() {
        if (!MessageCenter.instance) {
            MessageCenter.instance = new MessageCenter();
        }
        return MessageCenter.instance;
    }
    destroy() {
        this.subscribers = {};
    }
}
MessageCenter.instance = null;
module.exports =MessageCenter;