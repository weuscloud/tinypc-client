const settingsModel = new SettingsModel();
const gameModel = new GameModel();
const loading = new Loading('circle', '生成卡牌中');
loading._percentage_enabled = false;
const vm = new MVVM({
  el: '#app',
  deleteAfterCompiled: true,
  data: {
    cardCount: settingsModel.cardCount,
    maxNumber: settingsModel.maxNumber,
    timeLimit: settingsModel.timeLimit,
    fadeOutClass: '',
    expression_noSanitize: '',
    showOrHideClass: '',
    numbers: [0,0,0],
    message: '',
  },
  _timer: null,
  methods: {
    retryGame(){
      this.hideMenu();
      this.initTimer();
      this.startTimer() ;
    },

    goToSettings() {
      setTimeout(() => {
        window.location.href = 'settings.html';
      }, 500);
    },
    initTimer() {
      clearInterval(this._timer);
    },
    startTimer() {
      this.timeLimit=settingsModel.timeLimit;
      this._timer = setInterval(() => {
        this.timeLimit--;
        if (this.timeLimit <= 0) {
          this.timeLimit =0;
          this.showMenu('时间到！你被鸡蛋砸到了！');
        }
      }, 1000);
    },
    initInput() {
      this.expression_noSanitize = '';
    },
    hideMenu() {
      this.showOrHideClass = 'hide';
    },
    showMenu(text) {
      clearInterval(this._timer);
      this.message = text;
      this.showOrHideClass = 'show';
    },
    initNumbers() {
      // card.style.setProperty('--index', index); 
      this.numbers = [];
    },
      checkExpression() {
      const userExpression = this.expression_noSanitize;
      try {
        const result = eval(userExpression);
        if (result === 24) {
          this.showMenu('恭喜你，答案正确！');
        } else {
          this.showMenu('回答错误！你被鸡蛋砸到了！');
        }
      } catch (error) {
        this.showMenu('输入无效，请检查你的表达式。');
      }
    },
    submit(){
      this.checkExpression();
    },
    seeAnswer(){
       //清除计时器
       this.initTimer();
       //清除输入
       this.initInput();
       this.showMenu(`答案是:${gameModel.getAnswer()}`);
    },
    startNewGame() {
      //开启loading
      loading.waitting();
      //清除计时器
      this.initTimer();
      //清除输入
      this.initInput();
      //清除消息
      this.hideMenu();
      //清除卡牌
      this.initNumbers();
      //等待答案
      setTimeout(async () => {
        //model层的方法
        const numbers = await gameModel.generateNumbersAsync();
        loading.finish();
        this.numbers = numbers;
        this.startTimer();
      }, 500);

    }
  },
  created() {

    this.startNewGame();
  }
});