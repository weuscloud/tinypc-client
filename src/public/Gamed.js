const gameModel = new GameModel();;
const settingsModel = new SettingsModel();
const app = new MVVM({
    el: '#app',
    data: {
        numbers: [],
        difficulty: gameModel.difficulty,
        timeLimit: settingsModel.timeLimit,
        userExpression: '',
        message: '',
        showAnswerButton: false,
        showRetryButton: false,
        showNewGameButton: false,
        showResultContainer: false,
        resultContainerBottom: -200,
        resultContainerOpacity: 0,
        difficultyColors: {
            0: '#F0F0F0',
            1: '#C0C0C0',
            2: '#99CC00',
            3: '#0099FF',
            4: '#663399',
            5: '#FF6600',
            6: '#FF0000'
        },
        difficultyLevels: {
            0: '青铜',
            1: '白银',
            2: '黄金',
            3: '铂金',
            4: '钻石',
            5: '星耀',
            6: '王者'
        },
        difficultyWidth: 0,
        difficultyColor: '#000',
        difficultyLevel: '一般'
    },
    methods: {
        async startNewGame() {
            this.message = '';
            this.userExpression = '';
            this.showAnswerButton = false;
            this.showRetryButton = false;
            this.showNewGameButton = false;
            this.showResultContainer = false;
            this.resultContainerBottom = -200;
            this.resultContainerOpacity = 0;

            clearInterval(this.timer);
            this.timeLimit = settingsModel.timeLimit;

            const numbers = await gameModel.generateNumbersAsync();
            this.numbers = numbers;
            this.difficulty = gameModel.difficulty;
            this.updateDifficultyDisplay();

            this.timer = setInterval(() => {
                this.timeLimit--;
                if (this.timeLimit <= 0) {
                    clearInterval(this.timer);
                    this.showResultContainer = true;
                    this.resultContainerBottom = 0;
                    this.resultContainerOpacity = 1;
                    this.message = '时间到！你被鸡蛋砸到了！';
                }
            }, 1000);
        },
        checkExpression() {
            try {
                const result = eval(this.userExpression);
                if (result === 24) {
                    this.message = '恭喜你，答案正确！';
                    this.showAnswerButton = false;
                    this.showRetryButton = false;
                    this.showNewGameButton = true;
                } else {
                    this.message = '回答错误！你被鸡蛋砸到了！';
                    this.showAnswerButton = true;
                    this.showRetryButton = true;
                    this.showNewGameButton = true;
                }
                this.showResultContainer = true;
                this.resultContainerBottom = 0;
                this.resultContainerOpacity = 1;
            } catch (error) {
                this.message = '输入无效，请检查你的表达式。';
                this.showResultContainer = true;
                this.resultContainerBottom = 0;
                this.resultContainerOpacity = 1;
            }
        },
        showAnswer() {
            const answer = gameModel.getAnswer();
            this.message = `答案是：${answer}`;
        },
        retryGame() {
            this.startNewGame();
        },
        goToSettings() {
            window.location.href ='settings.html';
        },
        updateDifficultyDisplay() {
            if (this.difficulty < 0) {
                this.difficulty = 0;
            }
            if (this.difficulty > 6) {
                this.difficulty = 6;
            }
            this.difficultyWidth = ((this.difficulty + 1) * 100 / 7);
            this.difficultyColor = this.difficultyColors[this.difficulty];
            this.difficultyLevel = this.difficultyLevels[this.difficulty];
        }
    },
    created() {
        this.startNewGame();
    }
});