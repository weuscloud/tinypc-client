document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers');
    const expressionInput = document.getElementById('expression');
    const submitButton = document.getElementById('submit');
    const timerDisplay = document.getElementById('timer');
    const messageDisplay = document.getElementById('message');
    const newGameButton = document.getElementById('new-game');
    const difficultyDisplay = document.getElementById('difficulty');
    const difficultyLevelDisplay = document.getElementById('difficulty-level');
    const difficultyBar = document.querySelector('.difficulty-bar');

    let numbers = [];
    let timer;
    let timeLimit = 30;
    let solution = '';
    let difficulty = '一般'; // 默认难度

    function generateNumbers() {
        while (true) {
            numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10) + 1);
            solution = findSolution(numbers);
            if (solution) break;
        }
        displayNumbers();
        setDifficulty('随机'); // 确保在生成新数字时设置难度
    }

    function displayNumbers() {
        numbersContainer.innerHTML = '';
        numbers.forEach(num => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = num;
            numbersContainer.appendChild(card);
        });
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLimit--;
            timerDisplay.textContent = timeLimit;
            if (timeLimit <= 0) {
                clearInterval(timer);
                showMessage('时间到！你被鸡蛋砸到了！正确答案是：' + solution);
            }
        }, 1000);
    }

    function showMessage(message) {
        clearInterval(timer); // 停止倒计时
        messageDisplay.textContent = message;
        messageDisplay.classList.add('show');
        newGameButton.style.display = 'block';
    }

    function checkExpression() {
        const userExpression = expressionInput.value;
        try {
            const result = eval(userExpression);
            if (result === 24) {
                showMessage('恭喜你，答案正确！');
            } else {
                showMessage('回答错误！你被鸡蛋砸到了！正确答案是：' + solution);
            }
        } catch (error) {
            showMessage('输入无效，请检查你的表达式。');
        }
    }

    function startNewGame() {
        clearInterval(timer);
        timeLimit = 30;
        timerDisplay.textContent = timeLimit;
        expressionInput.value = '';
        messageDisplay.textContent = '';
        newGameButton.style.display = 'none';
        generateNumbers();
        startTimer();
    }

    function findSolution(nums) {
        const operators = ['+', '-', '*', '/'];
        const permutations = getPermutations(nums);
        for (const numPermutation of permutations) {
            for (const ops of getOperatorCombinations(operators)) {
                const expressions = generateExpressions(numPermutation, ops);
                for (const expr of expressions) {
                    if (evalExpression(expr) === 24) {
                        return expr;
                    }
                }
            }
        }
        return null;
    }

    function getPermutations(arr) {
        if (arr.length === 0) return [[]];
        const first = arr[0];
        const rest = arr.slice(1);
        const permsWithoutFirst = getPermutations(rest);
        const allPermutations = [];
        permsWithoutFirst.forEach(perm => {
            for (let i = 0; i <= perm.length; i++) {
                const permWithFirst = [...perm.slice(0, i), first, ...perm.slice(i)];
                allPermutations.push(permWithFirst);
            }
        });
        return allPermutations;
    }

    function getOperatorCombinations(operators) {
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

    function generateExpressions(nums, ops) {
        return [
            `(${nums[0]}${ops[0]}${nums[1]})${ops[1]}(${nums[2]}${ops[2]}${nums[3]})`,
            `(${nums[0]}${ops[0]}(${nums[1]}${ops[1]}${nums[2]}))${ops[2]}${nums[3]}`,
            `(${nums[0]}${ops[0]}${nums[1]})${ops[1]}${nums[2]}${ops[2]}${nums[3]}`,
            `${nums[0]}${ops[0]}(${nums[1]}${ops[1]}(${nums[2]}${ops[2]}${nums[3]}))`,
            `${nums[0]}${ops[0]}((${nums[1]}${ops[1]}${nums[2]})${ops[2]}${nums[3]})`
        ];
    }

    function evalExpression(expr) {
        try {
            return eval(expr);
        } catch {
            return null;
        }
    }

    function setDifficulty(level) {
        if (level === '随机') {
            let multiplicationOrDivisionCount = (solution.match(/[*\/]/g) || []).length;

            if (multiplicationOrDivisionCount >= 3) {
                difficulty = '最难';
                difficultyDisplay.style.width = '100%';
                difficultyDisplay.style.backgroundColor = 'red';
            } else if (multiplicationOrDivisionCount == 2) {
                difficulty = '中等';
                difficultyDisplay.style.width = '66%';
                difficultyDisplay.style.backgroundColor = 'yellow';
            } else if (multiplicationOrDivisionCount == 1) {
                difficulty = '一般';
                difficultyDisplay.style.width = '33%';
                difficultyDisplay.style.backgroundColor = 'green';
            } else {
                difficulty = '最简单';
                difficultyDisplay.style.width = '0%';
                difficultyDisplay.style.backgroundColor = 'white';
            }
        } else {
            difficulty = level;
            switch (level) {
                case '最难':
                    difficultyDisplay.style.width = '100%';
                    difficultyDisplay.style.backgroundColor = 'red';
                    break;
                case '中等':
                    difficultyDisplay.style.width = '66%';
                    difficultyDisplay.style.backgroundColor = 'yellow';
                    break;
                case '一般':
                    difficultyDisplay.style.width = '33%';
                    difficultyDisplay.style.backgroundColor = 'green';
                    break;
                case '最简单':
                    difficultyDisplay.style.width = '0%';
                    difficultyDisplay.style.backgroundColor = 'white';
                    break;
            }
        }
        difficultyLevelDisplay.textContent = difficulty;
    }

    submitButton.addEventListener('click', checkExpression);
    newGameButton.addEventListener('click', startNewGame);

    generateNumbers();
    startTimer();
});