class SettingsModel {
    constructor() {
        if(!SettingsModel.instance) {
            this._getAndSetInitialValue('cardCount', GameDefaults.CARD_COUNT);
            this._getAndSetInitialValue('maxNumber', GameDefaults.GENERATED_NUMBERS);
            this._getAndSetInitialValue('timeLimit', GameDefaults.TIME_LIMIT);
            SettingsModel.instance = this;
        }
        return SettingsModel.instance;
    }

    updateCardCount(newValue) {
        try {
            const validValue = validateValue('CARD_COUNT', newValue, GameDefaults);
            if (!isNaN(validValue)) {
                this._updateValue('cardCount', validValue);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    updateMaxNumber(newValue) {
        try {
            const validValue = validateValue('GENERATED_NUMBERS', newValue, GameDefaults);
            if (!isNaN(validValue)) {
                this._updateValue('maxNumber', validValue);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    updateTimeLimit(newValue) {
        try {
            const validValue = validateValue('TIME_LIMIT', newValue, GameDefaults);
            if (!isNaN(validValue)) {
                this._updateValue('timeLimit', validValue);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    _getAndSetInitialValue(key, defaultValue) {
        const storedValue = this._getStoredValue(key);
        if (!isNaN(storedValue)) {
            this[key] = storedValue;
        } else {
            this[key] = defaultValue;
            this._setStoredValue(key, defaultValue);
        }
    }

    _getStoredValue(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? parseInt(value, 10) : null;
        } catch (error) {
            return null;
        }
    }

    _setStoredValue(key, value) {
        try {
            localStorage.setItem(key, value.toString());
        } catch (error) {
            // 处理设置localStorage时的错误
        }
    }

    _updateValue(key, newValue) {
        const roundedValue = Math.round(newValue);
        this[key] = roundedValue;
    }
    saveSettings() {
        this._setStoredValue('cardCount', this.cardCount);
        this._setStoredValue('maxNumber', this.maxNumber);
        this._setStoredValue('timeLimit', this.timeLimit);
    }
}