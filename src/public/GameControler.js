const settingsModel = new SettingsModel();
const gameModel = new GameModel();
const loading = new Loading('circle', '生成卡牌中');
loading._percentage_enabled = false;
const difficultyColors = {
  0: '#F0F0F0', // 浅灰色，代表最低难度，给人一种轻松、简单的感觉
  1: '#C0C0C0', // 中等灰色
  2: '#99CC00', // 亮绿色，通常代表积极、顺利，适合较低难度
  3: '#0099FF', // 蓝色，给人专业、冷静的感觉，难度适中
  4: '#663399', // 紫色，常与神秘、高级相关联，难度较高
  5: '#FF6600', // 橙色，有活力且引人注意，代表较高难度
  6: '#FF0000'  // 红色，强烈且醒目，用于最高难度
};
const difficultyLevels = {
  0: '青铜',
  1: '白银',
  2: '黄金',
  3: '铂金',
  4: '钻石',
  5: '星耀',
  6: '王者'
};
const vm = new MVVM({
  el: '#app',
  deleteAfterCompiled: true,
  data: {
    cardCount: settingsModel.cardCount,
    maxNumber: settingsModel.maxNumber,
    timeLimit: settingsModel.timeLimit,
    fadeOutClass: '',
    expression_nosanitized: '',
    numbers: [],
    message: '',
    difficultyStyle: {},
    difficultyLevelDisplay: {},
    difficultyLevelText: "一般",
    resultContainerStyle: {
      bottom: '-200px',
      opacity: 0
    }
  },
  sanitized:false,
  _timer: null,
  methods: {
    retryGame() {
      this.hideMenu();
      this.initTimer();
      this.startTimer();
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
      this.timeLimit = settingsModel.timeLimit;
      this._timer = setInterval(() => {
        this.timeLimit--;
        if (this.timeLimit <= 0) {
          this.timeLimit = 0;
          this.showMenu('时间到！你被鸡蛋砸到了！');
        }
      }, 1000);
    },
    initInput() {
      this.expression_nosanitized = '';
    },

    resetResultContainer() {
      this.resultContainerStyle = {
        bottom: '-200px',
        opacity: 0
      }
    }
    ,
    showResultContainer() {
      this.resultContainerStyle = {
        bottom: '-0px',
        opacity: 1
      }
    },
    hideMenu() {
      this.resetResultContainer();
    },
    showMenu(text) {
      this.showResultContainer();
      clearInterval(this._timer);
      this.message = text;
    },
    updateDiffculty() {
      this.difficulty = gameModel.difficulty;
      this.difficultyStyle = {
        width: `${(this.difficulty + 1) * 100 / 7}%`,
        backgroundColor: difficultyColors[this.difficulty]
      }
      this.difficultyLevelDisplay = {
        color: difficultyColors[this.difficulty]
      }
      this.difficultyLevelText = difficultyLevels[this.difficulty];
    },
    checkExpression() {
      const userExpression = this.expression_nosanitized;
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
    submit() {
      this.checkExpression();
    },
    seeAnswer() {
      //清除计时器
      this.initTimer();
      //清除输入
      this.initInput();
      this.showMenu(`答案是:${gameModel.getAnswer()}`);
    },
    updateNumbers(numbers){
      this.numbers=numbers;
        let els= document.querySelectorAll('.card');
        els.forEach(el=>{
          el.style.setProperty('--index', el.$index);
        })
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
      //等待答案
      setTimeout(async () => {
        //model层的方法
        const numbers = await gameModel.generateNumbersAsync();
        loading.finish();
        this.updateNumbers(numbers);
        this.updateDiffculty();
        this.startTimer();
      }, 500);

    },
  },

  created() {

    this.startNewGame();
  }
});