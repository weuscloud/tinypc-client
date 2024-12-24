
class GameController {
    constructor() {
        this.model = new GameModel();
        this.numbersContainer = document.getElementById('numbers');
        this.expressionInput = document.getElementById('expression');
        this.submitButton = document.getElementById('submit');
        this.timerDisplay = document.getElementById('timer');
        this.messageDisplay = document.getElementById('message');
        this.newGameButton = document.getElementById('new-game');
        this.difficultyDisplay = document.getElementById('difficulty');
        this.difficultyLevelDisplay = document.getElementById('difficulty-level');
        this.difficultyBar = document.querySelector('.difficulty-bar');

        this.timeLimit = 30;
        this.timer;

        this.init();
    }

    init() {
        this.submitButton.addEventListener('click', this.checkExpression.bind(this));
        this.newGameButton.addEventListener('click', this.startNewGame.bind(this));
        this.startGame();
    }

    startGame() {
        const numbers = this.model.generateNumbers();
        this.displayNumbers(numbers);
        this.startTimer();
        this.updateDifficultyDisplay();
    }

    displayNumbers(numbers) {
        this.numbersContainer.innerHTML = '';
        numbers.forEach(num => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = num;
            this.numbersContainer.appendChild(card);
        });
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLimit--;
            this.timerDisplay.textContent = this.timeLimit;
            if (this.timeLimit <= 0) {
                clearInterval(this.timer);
                this.showMessage('时间到！你被鸡蛋砸到了！正确答案是：' + this.model.solution);
            }
        }, 1000);
    }

    showMessage(message) {
        clearInterval(this.timer);
        this.messageDisplay.textContent = message;
        this.messageDisplay.classList.add('show');
        this.newGameButton.style.display = 'block';
    }

    checkExpression() {
        const userExpression = this.expressionInput.value;
        try {
            const result = eval(userExpression);
            if (result === 24) {
                this.showMessage('恭喜你，答案正确！');
            } else {
                this.showMessage('回答错误！你被鸡蛋砸到了！正确答案是：' + this.model.solution);
            }
        } catch (error) {
            this.showMessage('输入无效，请检查你的表达式。');
        }
    }

    startNewGame() {
        clearInterval(this.timer);
        this.timeLimit = 30;
        this.timerDisplay.textContent = this.timeLimit;
        this.expressionInput.value = '';
        this.messageDisplay.textContent = '';
        this.newGameButton.style.display = 'none';
        this.startGame();
    }

    updateDifficultyDisplay() {
        const difficulty = this.model.difficulty;
        this.difficultyLevelDisplay.textContent = difficulty;
        switch (difficulty) {
            case '最难':
                this.difficultyDisplay.style.width = '100%';
                this.difficultyDisplay.style.backgroundColor ='red';
                break;
            case '中等':
                this.difficultyDisplay.style.width = '66%';
                this.difficultyDisplay.style.backgroundColor = 'yellow';
                break;
            case '一般':
                this.difficultyDisplay.style.width = '33%';
                this.difficultyDisplay.style.backgroundColor = 'green';
                break;
            case '最简单':
                this.difficultyDisplay.style.width = '0%';
                this.difficultyDisplay.style.backgroundColor = 'white';
                break;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});