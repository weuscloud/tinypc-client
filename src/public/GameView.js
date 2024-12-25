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
        this.resultContainer = document.querySelector('.result-container');
        this.menuButton=document.getElementById('menuButton');
        
        this.difficultyColors = {
            0: '#F0F0F0', // 浅灰色，代表最低难度，给人一种轻松、简单的感觉
            1: '#C0C0C0', // 中等灰色
            2: '#99CC00', // 亮绿色，通常代表积极、顺利，适合较低难度
            3: '#0099FF', // 蓝色，给人专业、冷静的感觉，难度适中
            4: '#663399', // 紫色，常与神秘、高级相关联，难度较高
            5: '#FF6600', // 橙色，有活力且引人注意，代表较高难度
            6: '#FF0000'  // 红色，强烈且醒目，用于最高难度
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
        numbers.forEach((num, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = num;
            card.style.setProperty('--index', index);
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
        this.messageDisplay.style.display = 'block'; // 确保消息框显示

        this.showResultContainer();

        // 调整按钮显示逻辑，确保布局稳定
        this.showNewGameButton();
        this.showAnswerButton();
        this.showRetryButton();
    }

    updateDifficultyDisplay(difficulty) {
        if (difficulty < 0) {
            difficulty = 0;
        }
        if (difficulty > 6) {
            difficulty = 6;
        }
        this.difficultyDisplay.style.width = `${(difficulty + 1) * 100 / 7}%`;
        this.difficultyDisplay.style.backgroundColor = this.difficultyColors[difficulty];
        this.difficultyLevelDisplay.textContent = this.difficultyLevels[difficulty];
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
        this.messageDisplay.style.display = 'none'; // 确保消息框隐藏
        this.resetResultContainer();
    }

    resetResultContainer() {
        this.resultContainer.classList.remove('show');
        // 确保在重新隐藏后，将其位置和透明度重置
        this.resultContainer.style.bottom = '-200px';
        this.resultContainer.style.opacity = 0;
    }

    showResultContainer() {
        this.resultContainer.classList.add('show');
        this.resultContainer.style.bottom = '0';
        this.resultContainer.style.opacity = 1;
    }
}