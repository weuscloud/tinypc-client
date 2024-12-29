class GameController {
    constructor() {
        this.model = new GameModel();
        this.view = new GameView();
        this.settingsModel = new SettingsModel();
        this.loading = new Loading('circle', '生成卡牌中');

        this.loading._percentage_enabled = false;
        this.init();
    }

    init() {
        this.view.submitButton.addEventListener('click', this.checkExpression.bind(this));
        this.view.newGameButton.addEventListener('click', this.startNewGame.bind(this));
        this.view.retryButton.addEventListener('click', this.retryGame.bind(this));
        this.view.answerButton.addEventListener('click', this.showAnswer.bind(this));
        // 点击菜单按钮跳转到设置页面
        this.view.menuButton.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
    }
    showAnswer() {
        const answer = this.model.getAnswer();
        this.view.showMessage(`答案是：${answer}`);
    }
    retryGame() {
        this.initTimer();
        this.view.clearInput();
        this.view.clearMessage();
        this.view.hideNewGameButton();
        this.view.hideAnswerButton();
        this.view.hideRetryButton();
        this.startTimer();
    }
    async startNewGame() {
        this.loading.waitting();

        //view层的方法
        this.initTimer();
        this.view.clearInput();
        this.view.clearMessage();
        
        this.view.hideNewGameButton();
        this.view.hideAnswerButton();
        this.view.hideRetryButton();
       
        setTimeout(async() => {
            //model层的方法
            const numbers = await this.model.generateNumbersAsync();
            this.loading.finish();
            this.view.displayNumbers(numbers);
            this.view.updateDifficultyDisplay(this.model.difficulty);
            this.startTimer();
        }, 500);

    }
    startTimer() {
        this.view.timer = setInterval(() => {
            this.timeLimit--;
            this.view.timerDisplay.textContent = this.timeLimit;
            if (this.timeLimit <= 0) {
                clearInterval(this.view.timer);
                this.view.showMessage('时间到！你被鸡蛋砸到了！');
            }
        }, 1000);
    }

    checkExpression() {
        const userExpression = this.view.expressionInput.value;
        try {
            const result = eval(userExpression);
            if (result === 24) {
                this.view.showMessage('恭喜你，答案正确！');
            } else {
                this.view.showMessage('回答错误！你被鸡蛋砸到了！');
            }
        } catch (error) {
            this.view.showMessage('输入无效，请检查你的表达式。');
        }
    }

    initTimer() {
        clearInterval(this.view.timer);
        this.timeLimit = this.settingsModel.timeLimit;
        this.view.timerDisplay.textContent = this.timeLimit;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameController().startNewGame();
})