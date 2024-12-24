// model.js
class GameModel {
    constructor() {
        this.numbers = [];
        this.solution = '';
        this.difficulty = '一般';
    }

    generateNumbers() {
        while (true) {
            this.numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 20) + 1);
            this.solution = this.findSolution(this.numbers);
            if (this.solution) break;
        }
        this.setDifficulty('随机');
        return this.numbers;
    }
    getAnswer(){
        return this.solution;
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
            } else if (multiplicationOrDivisionCount == 2) {
                this.difficulty = '中等';
            } else if (multiplicationOrDivisionCount == 1) {
                this.difficulty = '一般';
            } else {
                this.difficulty = '最简单';
            }
        } else {
            this.difficulty = level;
        }
        return this.difficulty;
    }
}
