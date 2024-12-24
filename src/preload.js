const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('Main', {
    _debugData: {},
    ipcRenderer: {
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
        send: (channel, data) => ipcRenderer.send(channel, data),
    },
    debug: async ({ tag = '', func = '', ...args } = {}) => {
        const result = await ipcRenderer.invoke('debug', { tag, func, args });
        this._debugData = JSON.parse(result);
        return result;
    },
});