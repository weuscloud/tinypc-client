// SettingsView.js
class SettingsView {
    constructor() {
      this.cardCountSlider = document.getElementById('cardCount');
      this.cardCountValue = document.getElementById('cardCountValue');
      this.maxNumberSlider = document.getElementById('maxNumber');
      this.maxNumberValue = document.getElementById('maxNumberValue');
      this.timeLimitSlider = document.getElementById('timeLimit');
      this.timeLimitValue = document.getElementById('timeLimitValue');
    }
  
    updateCardCountValue(newValue) {
      this.cardCountValue.textContent = newValue;
    }
  
    updateMaxNumberValue(newValue) {
      this.maxNumberValue.textContent = newValue;
    }
  
    updateTimeLimitValue(newValue) {
      this.timeLimitValue.textContent = newValue;
    }
  }
