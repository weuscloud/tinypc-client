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
        this.difficultyLevelDisplay.textContent = difficulty;
        switch (difficulty) {
            case '最难':
                this.difficultyDisplay.style.width = '100%';
                this.difficultyDisplay.style.backgroundColor = 'red';
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
