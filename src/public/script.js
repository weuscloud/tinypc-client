// gameClass.js
class Game {
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

        this.numbers = [];
        this.timer;
        this.timeLimit = 30;
        this.solution = '';
        this.difficulty = '一般'; // 默认难度

        this.init();
    }

    init() {
        this.submitButton.addEventListener('click', this.checkExpression.bind(this));
        this.newGameButton.addEventListener('click', this.startNewGame.bind(this));
        this.startGame();
    }

    generateNumbers() {
        while (true) {
            this.numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10) + 1);
            this.solution = this.findSolution(this.numbers);
            if (this.solution) break;
        }
        this.displayNumbers();
        this.setDifficulty('随机'); // 确保在生成新数字时设置难度
    }

    displayNumbers() {
        this.numbersContainer.innerHTML = '';
        this.numbers.forEach(num => {
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
                this.showMessage('时间到！你被鸡蛋砸到了！正确答案是：' + this.solution);
            }
        }, 1000);
    }

    showMessage(message) {
        clearInterval(this.timer); // 停止倒计时
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
                this.showMessage('回答错误！你被鸡蛋砸到了！正确答案是：' + this.solution);
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
        this.generateNumbers();
        this.startTimer();
    }

    findSolution(nums) {
        const operators = ['+', '-', '*', '/'];
        const permutations = this.getPermutations(nums);
        for (const numPermutation of permutations) {
            for (const ops of this.getOperatorCombinations(operators)) {
                const expressions = this.generateExpressions(numPermutation, ops);
                for (const expr of expressions) {
                    if (this.evalExpression(expr) === 24) {
                        return expr;
                    }
                }
            }
        }
        return null;
    }

    getPermutations(arr) {
        if (arr.length === 0) return [[]];
        const first = arr[0];
        const rest = arr.slice(1);
        const permsWithoutFirst = this.getPermutations(rest);
        const allPermutations = [];
        permsWithoutFirst.forEach(perm => {
            for (let i = 0; i <= perm.length; i++) {
                const permWithFirst = [...perm.slice(0, i), first,...perm.slice(i)];
                allPermutations.push(permWithFirst);
            }
        });
        return allPermutations;
    }

    getOperatorCombinations(operators) {
        const result = [];
        for (const op1 of operators) {
            for (const op2 of operators) {
                for (const op3 of operators) {
                    result.push([op1, op2, op3]);
                }
            }
        }
        return result;
    }

    generateExpressions(nums, ops) {
        return [
            `(${nums[0]}${ops[0]}${nums[1]})${ops[1]}(${nums[2]}${ops[2]}${nums[3]})`,
            `(${nums[0]}${ops[0]}(${nums[1]}${ops[1]}${nums[2]}))${ops[2]}${nums[3]}`,
            `(${nums[0]}${ops[0]}${nums[1]})${ops[1]}${nums[2]}${ops[2]}${nums[3]}`,
            `${nums[0]}${ops[0]}(${nums[1]}${ops[1]}(${nums[2]}${ops[2]}${nums[3]}))`,
            `${nums[0]}${ops[0]}((${nums[1]}${ops[1]}${nums[2]})${ops[2]}${nums[3]})`
        ];
    }

    evalExpression(expr) {
        try {
            return eval(expr);
        } catch {
            return null;
        }
    }

    setDifficulty(level) {
        if (level === '随机') {
            let multiplicationOrDivisionCount = (this.solution.match(/[*\/]/g) || []).length;

            if (multiplicationOrDivisionCount >= 3) {
                this.difficulty = '最难';
                this.difficultyDisplay.style.width = '100%';
                this.difficultyDisplay.style.backgroundColor = 'red';
            } else if (multiplicationOrDivisionCount == 2) {
                this.difficulty = '中等';
                this.difficultyDisplay.style.width = '66%';
                this.difficultyDisplay.style.backgroundColor = 'yellow';
            } else if (multiplicationOrDivisionCount == 1) {
                this.difficulty = '一般';
                this.difficultyDisplay.style.width = '33%';
                this.difficultyDisplay.style.backgroundColor = 'green';
            } else {
                this.difficulty = '最简单';
                this.difficultyDisplay.style.width = '0%';
                this.difficultyDisplay.style.backgroundColor = 'white';
            }
        } else {
            this.difficulty = level;
            switch (level) {
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
        this.difficultyLevelDisplay.textContent = this.difficulty;
    }

    startGame() {
        this.generateNumbers();
        this.startTimer();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});