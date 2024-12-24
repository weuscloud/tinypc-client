const env = require('../env.json');
class Base {
    init() {
        // Initialization code here
    }
    destroy() {
        // Cleanup code here
    }
    isDebug() {
        // Debug code here
        return env.isDev==='true';
    }
}

module.exports = Base;