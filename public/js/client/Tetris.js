class Tetris {
    constructor(name, userID) {
        this.game = new Game(name);
        this.userID = userID;
        this.colors = ["white", "#800000", "#cccc00", "#006000", "#000000", "#000099", "#660066", "#e62e00", "black"];
    }

    setCanvas(cvs, SQ) {
        this.cvs = cvs;
        this.ctx = this.cvs.getContext('2d');
        this.SQ = SQ;
    }

    drawSquare(x, y, color, a, b) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(a + x * this.SQ, b + y * this.SQ, this.SQ, this.SQ);

        this.ctx.strokeStyle = this.colors[8];
        this.ctx.strokeRect(a + x * this.SQ, b + y * this.SQ, this.SQ, this.SQ);

    }

    draw(a, b) {
        let board = this.board.matrix;
        for (let r = 0; r < this.game.gameBoard.ROW; r++) {
            for (let c = 0; c < this.game.gameBoard.COL; c++) {
                let color = board[r][c];
                this.drawSquare(c, r, this.colors[color], a, b);
            }
        }
    }

    drawNext() {
        let nextPiece = this.game.nextPiece.activeShape;
        console.log(nextPiece);
        this.ctx.font = '23px Arial';
        this.ctx.strokeStyle = 'BLACK';
        this.ctx.strokeText('NEXT', 30, 110);
        for (let x = 0; x < nextPiece.length; x++) {
            for (let y = 0; y < nextPiece.length; y++) {
                let color = this.colors[nextPiece[y][x]];
                this.ctx.fillStyle = color;
                this.ctx.fillRect(30 + x * this.SQ, 120 + y * this.SQ, this.SQ, this.SQ);
                this.ctx.strokeStyle = 'BLACK';
                this.ctx.strokeRect(30 + x * this.SQ, 120 + y * this.SQ, this.SQ, this.SQ);
            }
        }
    }

    drawHold() {
        let holdPiece = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        if (this.game.InHold) {
            holdPiece = this.game.InHold.activeShape;
        }
        console.log(holdPiece);
        this.ctx.font = '23px Arial';
        this.ctx.strokeStyle = 'BLACK';
        this.ctx.strokeText('HOLD', 330, 110);
        for (let x = 0; x < holdPiece.length; x++) {
            for (let y = 0; y < holdPiece.length; y++) {
                let color = this.colors[holdPiece[y][x]];
                this.ctx.fillStyle = color;
                this.ctx.fillRect(330 + x * this.SQ, 120 + y * this.SQ, this.SQ, this.SQ);
                this.ctx.strokeStyle = 'BLACK';
                this.ctx.strokeRect(330 + x * this.SQ, 120 + y * this.SQ, this.SQ, this.SQ);
            }
        }
    }


    serialize() {
        return {
            board: {
                matrix: this.game.showMatrix,
            },
            player: {
                name: this.game.player.name,
                score: this.game.player.score,
                status: this.game.status
            }

        };
    }

    deSerialize(gameState) {
        this.board = Object.assign(gameState.board);
        this.player = Object.assign(gameState.player);

    }
}