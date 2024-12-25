// SettingsModel.js
class SettingsModel {
    constructor() {
      this.cardCount = localStorage.getItem('cardCount') || 4;
      this.maxNumber = localStorage.getItem('maxNumber') || 10;
      this.timeLimit = localStorage.getItem('timeLimit') || 30;
    }
  
    updateCardCount(newValue) {
      this.cardCount = newValue;
      localStorage.setItem('cardCount', newValue);
    }
  
    updateMaxNumber(newValue) {
      this.maxNumber = newValue;
      localStorage.setItem('maxNumber', newValue);
    }
  
    updateTimeLimit(newValue) {
      this.timeLimit = newValue;
      localStorage.setItem('timeLimit', newValue);
    }
  }
