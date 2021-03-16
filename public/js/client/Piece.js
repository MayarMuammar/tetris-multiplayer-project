class Piece {

    constructor(pId, rotId = 0) {
        this.xPos = 3;
        this.yPos = -1;
        this.rotId = rotId;
        this.tetromino = undefined;
        this.activeShape = undefined;
        switch (pId) {
            case 1:
                this.tetromino = I;
                this.activeShape = this.tetromino[this.rotId];
                break;
            case 2:
                this.tetromino = J;
                this.activeShape = this.tetromino[this.rotId];
                break;
            case 3:
                this.tetromino = L;
                this.activeShape = this.tetromino[this.rotId];
                break;
            case 4:
                this.tetromino = O;
                this.activeShape = this.tetromino[this.rotId];
                break;
            case 5:
                this.tetromino = S;
                this.activeShape = this.tetromino[this.rotId];
                break;
            case 6:
                this.tetromino = T;
                this.activeShape = this.tetromino[this.rotId];
                break;
            case 7:
                this.tetromino = Z;
                this.activeShape = this.tetromino[this.rotId];
                break;

        }

    }

    rotate() {
        this.rotId = (this.rotId + 1) % this.tetromino.length; // (0+1)%4 => 1
        this.activeShape = this.tetromino[this.rotId];
    }

    getNextPattern() {
        let newRot = (this.rotId + 1) % this.tetromino.length;
        let piece = {
            xPos: this.xPos,
            yPos: this.yPos,
            rotId: newRot,
            tetromino: this.tetromino,
            activeShape: this.tetromino[newRot]
        };

        // let next = new Piece(this.pId, newRot);
        // next.activeShape = this.tetromino[newRot];
        return piece;
    }
}