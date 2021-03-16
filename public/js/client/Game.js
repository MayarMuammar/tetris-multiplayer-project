class Game {
    constructor(name) {
        this.gameBoard = new Board();
        // window.gameBoard = this.gameBoard;
        this.player = new Player(name);
        this.currPiece = null;
        this.nextPiece = null;
        this.dropInterval = 1000;
        this.controller = new PieceManager(this);
        this.generatePiece();
        this.gameBoard.initBoard();
        this.showMatrix = this.gameBoard.merge();
        this.InHold = null;
        // window.CONTROL = this.CONTROL;
        // this.scoreSound = new Sound('multimedia/a.mp3');
    }

    CONTROL(event) {
        if (event.keyCode === 37) {
            // event.preventDefault();
            this.controller.moveLeft();
        } else if (event.keyCode === 38) {
            // event.preventDefault();
            this.controller.Rotate();
        } else if (event.keyCode === 39) {
            // event.preventDefault();
            this.controller.moveRight();
        } else if (event.keyCode === 40) {
            // event.preventDefault();
            let stack = this.controller.moveDown();
            if (stack && !this.status) {
                this.gameBoard.addPiece(this.currPiece);
                let r = this.gameBoard.clearRow();
                console.log(r);
                if (r > 0) { this.updateScore(r); }
                this.currPiece = this.nextPiece;
                this.generatePiece();
            } else if (this.status) {
                game.pause();
            }
        } else if (event.keyCode === 17) {
            // if (this.InHold !== null) {
            this.controller.holdPiece();
            // } else {
            //     this.controller.unHoldPiece();
            //     // this.controller.holdPiece();
            // }
        } else if (event.keyCode === 18) {
            if (this.InHold !== null) {
                this.controller.unHoldPiece();
            }
        }
    }

    generatePiece() {
        let randomNum = Math.floor(Math.random() * 7);
        this.nextPiece = new Piece(randomNum + 1);
        if (this.currPiece === null) {
            this.currPiece = this.nextPiece;
            this.generatePiece();
        }
        // window.currPiece = this.currPiece;

    }

    start() {
        window.autoDrop = this.autoDrop.bind(this);
        this.IntervalID = setInterval(function() { window.autoDrop(); }, this.dropInterval);
        console.log(this.IntervalID);
        // this.scoreSound.play();
    }

    autoDrop() {
        this.status = this.gameBoard.isGameOver(this.currPiece);
        let stack = this.controller.moveDown();
        if (stack && !this.status) {
            this.gameBoard.addPiece(this.currPiece);
            let r = this.gameBoard.clearRow();
            if (r > 0) { this.updateScore(r); }
            this.currPiece = this.nextPiece;
            this.generatePiece();
        } else if (this.gameBoard.isGameOver(this.currPiece)) {
            this.pause();
            this.over = true;
            $(".gameover").show();
        }
        this.showMatrix = this.gameBoard.merge();
    }

    pause() {
        clearInterval(this.IntervalID);
    }

    Bonus(b) {
        console.log('in Bonus funciton', b);
        this.player.bonusCount += 1;
        if (b === 4) {
            this.player.score += 40
        }
    }

    updateScore(r) {
        console.log('updating score ', r)
        this.player.score += 10 * r;
        if (r > 1) {
            console.log('calling bonus', r);
            this.Bonus(r);
        }
    }

    levelUp() {
        let d = this.dropInterval;
        if (this.player.score >= 250) {
            //Level 2
            d = 900;
            this.player.level = 2;
        } else if (this.player.score >= 500) {
            //Level 3
            this.player.level = 3;
            d = 800;
        } else if (this.player.score >= 1000) {
            //Level 4
            this.player.level = 4;
            d = 650;
        } else if (this.player.score >= 2000) {
            //Level 5
            this.player.level = 5;
            d = 500;
        } else if (this.player.score >= 3500) {
            //Level 6
            this.player.level = 6;
            d = 350;
        }

        if (d !== this.dropInterval) {
            this.dropInterval = d;
            this.start();
        }
    }
}