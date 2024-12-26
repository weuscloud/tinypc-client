// SettingsController.js
class SettingsController {
  constructor() {
    this.model = new SettingsModel();
    this.view = new SettingsView();
    this.view.setDefaultValues(this.model.cardCount, this.model.maxNumber, this.model.timeLimit);
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

    this.view.startGame.addEventListener('click', this.startNewGame.bind(this));
    //不做任何改变
    this.view.menuButton.addEventListener('click', this.view.go2GamePage);

  }
  startNewGame() {
    this.model.saveSettings();
    this.view.go2GamePage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SettingsController();
});