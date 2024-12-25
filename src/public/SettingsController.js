// SettingsController.js
class SettingsController {
  constructor() {
    this.model = new SettingsModel();
    this.view = new SettingsView();

    this.initEventListeners();
  }

  initEventListeners() {
    this.view.cardCountSlider.addEventListener('input', () => {
      const newValue = this.view.cardCountSlider.value;
      this.model.updateCardCount(newValue);
      this.view.updateCardCountValue(newValue);
    });

    this.view.maxNumberSlider.addEventListener('input', () => {
      const newValue = this.view.maxNumberSlider.value;
      this.model.updateMaxNumber(newValue);
      this.view.updateMaxNumberValue(newValue);
    });

    this.view.timeLimitSlider.addEventListener('input', () => {
      const newValue = this.view.timeLimitSlider.value;
      this.model.updateTimeLimit(newValue);
      this.view.updateTimeLimitValue(newValue);
    });

    document.getElementById('startGame').addEventListener('click', () => {
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = 'Game.html';
      }, 500);
    });

    document.getElementById('menuButton').addEventListener('click', () => {
      window.location.href = 'Game.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SettingsController();
});