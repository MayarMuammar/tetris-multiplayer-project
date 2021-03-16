class PieceManager {
    constructor(scope) {
        this.scope = scope;
    }

    collide(x, y, shape) {
        var r, c;
        for (r = 0; r < shape.activeShape.length; r++) {
            for (c = 0; c < shape.activeShape.length; c++) {
                if (shape.activeShape[r][c] === 0) {
                    continue;
                }

                let newX = shape.xPos + c + x;
                let newY = shape.yPos + r + y;

                if (newX < 0 || newX >= this.scope.gameBoard.COL || newY >= this.scope.gameBoard.ROW) {
                    return true;
                }

                if (newY < 0) {
                    continue;
                }

                if (this.scope.gameBoard.matrix[newY][newX][0] !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    moveDown() {
        if (!this.collide(0, 1, this.scope.currPiece)) {
            this.scope.gameBoard.clearMovingMat();
            this.scope.currPiece.yPos++;
            this.scope.gameBoard.updateMovingMat(this.scope.currPiece);
            return false;
        } else {
            return true;
        }
    }

    moveLeft() {
        if (!this.collide(-1, 0, this.scope.currPiece)) {
            this.scope.gameBoard.clearMovingMat();
            this.scope.currPiece.xPos--;
            this.scope.gameBoard.updateMovingMat(this.scope.currPiece);
        }
    }

    moveRight() {
        let m = this.collide(1, 0, this.scope.currPiece);
        if (!m) {
            this.scope.gameBoard.clearMovingMat();
            this.scope.currPiece.xPos++;
            this.scope.gameBoard.updateMovingMat(this.scope.currPiece);
        }
        return m;
    }

    Rotate() {
        let nextPattern = this.scope.currPiece.getNextPattern();
        console.log(nextPattern);
        let kick = 0;
        if (this.collide(0, 0, nextPattern)) {
            if (nextPattern.xPos > this.scope.gameBoard.COL / 2) {
                //right wall 
                kick = -1; // move the piece to the left
            } else {
                //left wall
                kick = 1; // move the piece to the right 
            }
        }
        console.log(kick);
        if (!this.collide(kick, 0, nextPattern)) {
            this.scope.gameBoard.clearMovingMat();
            this.scope.currPiece.xPos += kick;
            this.scope.currPiece.rotate();
            this.scope.gameBoard.updateMovingMat(this.scope.currPiece);
        }
    }

    holdPiece() {
        if (this.scope.player.bonusCount > 0) {
            this.scope.InHold = this.scope.currPiece;
            this.scope.currPiece = this.scope.nextPiece;
            this.scope.generatePiece();
            this.scope.player.bonusCount--;

        }
    }

    unHoldPiece() {
        if (this.scope.InHold) {
            this.scope.InHold.xPos = this.scope.currPiece.xPos;
            this.scope.InHold.yPos = this.scope.currPiece.yPos;
            this.scope.currPiece = this.scope.InHold;
            this.scope.InHold = null;
        }
    }
}