class GameView {
    constructor() {
        this.numbersContainer = document.getElementById('numbers');
        this.expressionInput = document.getElementById('expression');
        this.submitButton = document.getElementById('submit');
        this.timerDisplay = document.getElementById('timer');
        this.messageDisplay = document.getElementById('message');
        this.newGameButton = document.getElementById('new-game');
        this.difficultyDisplay = document.getElementById('difficulty');
        this.difficultyLevelDisplay = document.getElementById('difficulty-level');
        this.difficultyBar = document.querySelector('.difficulty-bar');

        this.retryButton = document.getElementById('retry');
        this.answerButton = document.getElementById('answer');

        this.difficultyColors = {
            0: 'white',
            1: 'gray',
            2: 'green',
            3: 'blue',
            4: 'purple',
            5: 'orange',
            6: 'red'
        };
        this.difficultyLevels = {
            0: '青铜',
            1: '白银',
            2: '黄金',
            3: '铂金',
            4: '钻石',
            5: '星耀',
            6: '王者'
        };
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

    startTimer(timeLimit) {
        this.timer = setInterval(() => {
            timeLimit--;
            this.timerDisplay.textContent = timeLimit;
            if (timeLimit <= 0) {
                clearInterval(this.timer);
                this.showMessage('时间到！你被鸡蛋砸到了！');
            }
        }, 1000);
    }

    showMessage(message) {
        clearInterval(this.timer);
        this.messageDisplay.textContent = message;
        this.messageDisplay.classList.add('show');

        this.showNewGameButton();
        this.showAnswerButton();
        this.showRetryButton();
    }

    updateDifficultyDisplay(difficulty) {

        this.difficultyDisplay.style.width = `${(difficulty + 1) * 100 / 7}%`;
        this.difficultyDisplay.style.backgroundColor = this.difficultyColors[difficulty];
        this.difficultyLevelDisplay.textContent =this.difficultyLevels[difficulty];
        this.difficultyLevelDisplay.style.color = this.difficultyColors[difficulty];
    }

    clearInput() {
        this.expressionInput.value = '';
    }
    hideAnswerButton() {
        this.answerButton.style.display = 'none';
    }
    showAnswerButton() {
        this.answerButton.style.display = 'block';
    }

    hideRetryButton() {
        this.retryButton.style.display = 'none';
    }
    showRetryButton() {
        this.retryButton.style.display = 'block';
    }

    hideNewGameButton() {
        this.newGameButton.style.display = 'none';
    }
    showNewGameButton() {
        this.newGameButton.style.display = 'block';
    }
    clearMessage() {
        this.messageDisplay.textContent = '';
        this.messageDisplay.classList.remove('show');
    }
}
