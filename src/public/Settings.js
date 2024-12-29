const settingsModel = new SettingsModel();
const vm = new MVVM({
  el: '#app',
  data: {
    cardCount: settingsModel.cardCount,
    maxNumber: settingsModel.maxNumber,
    timeLimit: settingsModel.timeLimit,
    fadeOutClass: '',
  },
  methods: {
    cardCountChanged: function(value)  {
      settingsModel.updateCardCount(value);
    },
    maxNumberChanged:function (value)  {

      settingsModel.updateMaxNumber(value);
    },
    timeLimitChanged:function (value)  {
      settingsModel.updateTimeLimit(value);
    },
    startGame() {
      settingsModel.saveSettings();
      this.backToGame();
    },
    backToGame(){
      this.fadeOutClass = 'fade-out';
      setTimeout(() => {
        window.location.href = 'Game.html';
      }, 500);
    },
  }
});