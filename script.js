class DartScoreApp {
    constructor() {
        this.startingScore = 501;
        this.gameType = 'double';
        this.currentPlayer = 1;
        this.player1Scores = [];
        this.player2Scores = [];
        this.player1Total = this.startingScore;
        this.player2Total = this.startingScore;

        this.initElements();
        this.addEventListeners();
    }

    initElements() {
        this.startingScoreInput = document.getElementById('starting-score');
        this.gameTypeSelect = document.getElementById('game-type');
        this.player1ScoreElement = document.getElementById('player1-score');
        this.player2ScoreElement = document.getElementById('player2-score');
        this.player1AvgElement = document.getElementById('player1-avg');
        this.player2AvgElement = document.getElementById('player2-avg');
        this.scoreInput = document.getElementById('score-input');
        this.enterScoreButton = document.getElementById('enter-score');
        this.undoScoreButton = document.getElementById('undo-score');
    }

    addEventListeners() {
        this.startingScoreInput.addEventListener('change', () => this.resetGame());
        this.gameTypeSelect.addEventListener('change', () => this.gameType = this.gameTypeSelect.value);
        this.enterScoreButton.addEventListener('click', () => this.enterScore());
        this.undoScoreButton.addEventListener('click', () => this.undoScore());
    }

    enterScore() {
        const score = parseInt(this.scoreInput.value);
        if (isNaN(score) || score < 0 || score > 180) return;

        if (this.currentPlayer === 1) {
            if (score <= this.player1Total) {
                this.player1Scores.push(score);
                this.player1Total -= score;
                this.player1ScoreElement.textContent = this.player1Total;
                this.updateAverage(1);
                this.currentPlayer = 2;
            }
        } else {
            if (score <= this.player2Total) {
                this.player2Scores.push(score);
                this.player2Total -= score;
                this.player2ScoreElement.textContent = this.player2Total;
                this.updateAverage(2);
                this.currentPlayer = 1;
            }
        }

        this.scoreInput.value = '';
        this.checkWin();
    }

    undoScore() {
        if (this.currentPlayer === 1 && this.player2Scores.length) {
            const score = this.player2Scores.pop();
            this.player2Total += score;
            this.player2ScoreElement.textContent = this.player2Total;
            this.updateAverage(2);
            this.currentPlayer = 2;
        } else if (this.currentPlayer === 2 && this.player1Scores.length) {
            const score = this.player1Scores.pop();
            this.player1Total += score;
            this.player1ScoreElement.textContent = this.player1Total;
            this.updateAverage(1);
            this.currentPlayer = 1;
        }
    }

    updateAverage(player) {
        const scores = player === 1 ? this.player1Scores : this.player2Scores;
        const avg = scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0;
        const avgElement = player === 1 ? this.player1AvgElement : this.player2AvgElement;
        avgElement.textContent = avg.toFixed(2);
    }

    checkWin() {
        if (this.player1Total === 0) {
            if (this.gameType === 'double' && this.player1Scores[this.player1Scores.length - 1] % 2 !== 0) {
                this.player1Total += this.player1Scores.pop();
                this.player1ScoreElement.textContent = this.player1Total;
                this.updateAverage(1);
            } else {
                alert('Player 1 wins!');
                this.resetGame();
            }
        } else if (this.player2Total === 0) {
            if (this.gameType === 'double' && this.player2Scores[this.player2Scores.length - 1] % 2 !== 0) {
                this.player2Total += this.player2Scores.pop();
                this.player2ScoreElement.textContent = this.player2Total;
                this.updateAverage(2);
            } else {
                alert('Spieler 2 wins!');
                this.resetGame();
            }
        }
    }

    resetGame() {
        this.startingScore = parseInt(this.startingScoreInput.value) || 501;
        this.player1Scores = [];
        this.player2Scores = [];
        this.player1Total = this.startingScore;
        this.player2Total = this.startingScore;
        this.player1ScoreElement.textContent = this.player1Total;
        this.player2ScoreElement.textContent = this.player2Total;
        this.player1AvgElement.textContent = '0';
        this.player2AvgElement.textContent = '0';
        this.currentPlayer = 1;
    }
}

const app = new DartScoreApp();
