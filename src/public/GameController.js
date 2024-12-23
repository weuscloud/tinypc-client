class GameController {
    constructor() {
        this.model = new GameModel();
        this.view = new GameView();
        this.timeLimit = localStorage.getItem('timeLimit') || 30;
        this.init();
    }

    init() {
        this.view.submitButton.addEventListener('click', this.checkExpression.bind(this));
        this.view.newGameButton.addEventListener('click', this.startNewGame.bind(this));
        this.view.retryButton.addEventListener('click', this.retryGame.bind(this));
        this.view.answerButton.addEventListener('click', this.showAnswer.bind(this));
        this.startGame();
    }
    showAnswer() {
        const answer = this.model.getAnswer();
        this.view.showMessage(`答案是：${answer}`);
    }
    retryGame() {
        clearInterval(this.view.timer);
        this.timeLimit = localStorage.getItem('timeLimit') || 30;;
        this.view.timerDisplay.textContent = this.timeLimit;
        this.view.clearInput();
        this.view.clearMessage();
        this.view.hideNewGameButton();
        this.view.hideAnswerButton();
        this.view.hideRetryButton();
        this.startTimer();
    }
    startGame() {
        const numbers = this.model.generateNumbers();
        this.view.displayNumbers(numbers);
        this.startTimer();
        this.view.updateDifficultyDisplay(this.model.difficulty);
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

    startNewGame() {
        clearInterval(this.view.timer);
        this.timeLimit = 30;
        this.view.timerDisplay.textContent = this.timeLimit;
        this.view.clearInput();
        this.view.clearMessage();
        this.view.hideNewGameButton();
        this.view.hideAnswerButton();
        this.view.hideRetryButton();
        this.startGame();
    }

}
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});