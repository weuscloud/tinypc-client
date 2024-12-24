const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

class App {
    constructor() {
        if (App.instance) {
            return App.instance;
        }
        App.instance = this;
    }

    createWindow() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                // preload: path.join(__dirname, 'preload.js')
            }
        })

        win.loadFile('./src/public/index.html')
        win.removeMenu(); // 移除默认的功能菜单

        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'F12' && input.type === 'keyDown') {
                win.webContents.openDevTools();
            }
        });
    }

    start() {
        const gotTheLock = app.requestSingleInstanceLock();

        if (!gotTheLock) {
            app.quit();
        } else {
            app.on('second-instance', () => {
                const win = BrowserWindow.getAllWindows()[0];
                if (win) {
                    if (win.isMinimized()) win.restore();
                    win.focus();
                }
            });

            app.whenReady().then(() => {
                this.createWindow()

                app.on('activate', () => {
                    if (BrowserWindow.getAllWindows().length === 0) {
                        this.createWindow()
                    }
                })
            })

            app.on('window-all-closed', () => {
                if (process.platform !== 'darwin') {
                    app.quit()
                }
            })
        }
    }
}

module.exports = App;