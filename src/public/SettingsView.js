// SettingsView.js
class SettingsView {
  constructor() {
    this.cardCountSlider = document.getElementById('cardCount');
    this.cardCountValue = document.getElementById('cardCountValue');

    this.maxNumberSlider = document.getElementById('maxNumber');
    this.maxNumberValue = document.getElementById('maxNumberValue');

    this.timeLimitSlider = document.getElementById('timeLimit');
    this.timeLimitValue = document.getElementById('timeLimitValue');

    this.startGame = document.getElementById('startGame');
    this.menuButton = document.getElementById('menuButton')
  }
  setDefaultValues(cardCount, maxNumber, timeLimit) {
    this.cardCountSlider.value = cardCount;
    this.updateCardCountValue(cardCount);

    this.maxNumberSlider.value = maxNumber;
    this.updateMaxNumberValue(maxNumber);

    this.timeLimitSlider.value = timeLimit;
    this.updateTimeLimitValue(timeLimit);
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
  go2GamePage() {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = 'Game.html';
    }, 500);
  }
}
