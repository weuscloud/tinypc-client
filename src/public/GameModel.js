class GameModel {
    constructor() {
        this.settingsModel = new SettingsModel();
        this.numbers = [];
        this.solution = '';
        this.difficulty = 0;    
        this.cardCount = this.settingsModel.cardCount; 
        this.maxNumber = this.settingsModel.maxNumber;
        this.finalResult = 24;// 目标结果24
        this.evalCount = 0; // 记录评估次数
        this.solutionFound = false; // 标记是否找到答案
    }

    setCardCount(count) {
        if (count < 3 || count > 10) {
            throw new Error('卡牌数量必须在3到10之间');
        }
        this.cardCount = count;
    }

    async generateNumbersAsync() {
        return new Promise((resolve, reject) => {
            try {
                resolve( this.generateNumbers());
            } catch (error) {
                reject(error);
            }
        });
    }

    generateNumbers() {
        while (true) {
            this.numbers = Array.from({ length: this.cardCount }, () => Math.floor(Math.random() * this.maxNumber) + 1);
            this.solution = this.findSolution(this.numbers);
            if (this.solution) break;
        }
        this.setDifficulty();
        return this.numbers;
    }

    async findSolutionAsync(nums) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = this.findSolution(nums);
                resolve(result);
            }, 0);
        });
    }

    getAnswer() {
        return this.solution;
    }

    findSolution(nums) {
        const operators = ['+', '-', '*', '/'];
        const permutations = this.getPermutations(nums);
        this.evalCount = 0; // 重置评估计数

        for (const numPermutation of permutations) {
            for (const ops of this.getOperatorCombinations(operators, numPermutation.length - 1)) {
                const expressions = this.generateExpressions(numPermutation, ops);
                for (const expr of expressions) {
                    if (this.safeEval(expr) === this.finalResult) {
                        this.solutionFound = true;
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
                const permWithFirst = [...perm.slice(0, i), first, ...perm.slice(i)];
                allPermutations.push(permWithFirst);
            }
        });
        return allPermutations;
    }

    getOperatorCombinations(operators, opCount) {
        const result = [];
        function generateCombinations(current = [], depth = 0) {
            if (depth === opCount) {
                result.push([...current]);
                return;
            }
            for (const operator of operators) {
                generateCombinations([...current, operator], depth + 1);
            }
        }
        generateCombinations([], 0);
        return result;
    }

    generateExpressions(nums, ops) {
        const exprs = [];
        let expr = nums[0].toString();
        for (let i = 0; i < ops.length; i++) {
            expr = `(${expr}${ops[i]}${nums[i + 1]})`;
        }
        exprs.push(expr);
        return exprs;
    }

    safeEval(expr) {
        try {
            this.evalCount++; // 增加评估次数
            const result = eval(expr);
            return Math.abs(result - this.finalResult) < 0.0001 ? result : null;
        } catch {
            return null;
        }
    }

    setDifficulty() {
        const multiplications = (this.solution.match(/[*]/g) || []).length;
        const divisions = (this.solution.match(/[/]/g) || []).length;
        const parentheses = (this.solution.match(/[()]/g) || []).length / 2;

        // 动态难度评分基于评估次数
        const evalScore = Math.log10(this.evalCount + 1) * 10;
        const complexityScore = multiplications * 2 + divisions * 3 + parentheses * 1.5;
        this.difficulty = Math.round(evalScore + complexityScore);
        this.difficulty = parseInt(this.difficulty / 10);
        return this.difficulty;
    }
}
