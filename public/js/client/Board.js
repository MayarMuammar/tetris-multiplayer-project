class Board {

    constructor() {
        this.matrix = [];
        this.layer;
        this.ROW = 20;
        this.COL = 10;
    }

    initBoard() {
        for (let r = 0; r < this.ROW; r++) {
            this.matrix[r] = [];
            for (let c = 0; c < this.COL; c++) {
                this.matrix[r][c] = [];
                this.matrix[r][c][0] = 0;
                this.matrix[r][c][1] = 0;
            }
        }
        console.log('i am initBoard and the board is ', this.matrix);
        debugger

    }

    init2dBoard() {
        let b = [];
        for (let r = 0; r < this.ROW; r++) {
            b[r] = [];
            for (let c = 0; c < this.COL; c++) {
                b[r][c] = 0;
            }
        }
        return b;
    }

    merge() {
        let dBoard = this.init2dBoard();
        for (let r = 0; r < this.ROW; r++) {
            for (let c = 0; c < this.COL; c++) {
                if (this.matrix[r][c][0] === 0) {
                    dBoard[r][c] = this.matrix[r][c][1];
                } else {
                    dBoard[r][c] = this.matrix[r][c][0];
                }

            }
        }
        return dBoard;
    }

    clearMovingMat() {
        for (let r = 0; r < this.ROW; r++) {
            for (let c = 0; c < this.COL; c++) {
                this.matrix[r][c][1] = 0;
            }
        }
    }

    updateMovingMat(piece) {
        for (let i = 0; i < piece.activeShape.length; i++) {
            for (let j = 0; j < piece.activeShape.length; j++) {
                if (piece.activeShape[i][j] > 0) {
                    this.matrix[piece.yPos + i][piece.xPos + j][1] = piece.activeShape[i][j];
                }
            }
        }
    }

    addPiece(piece) {
        for (let i = 0; i < piece.activeShape.length; i++) {
            for (let j = 0; j < piece.activeShape.length; j++) {
                if (piece.activeShape[i][j] > 0) {
                    this.matrix[piece.yPos + i][piece.xPos + j][0] = piece.activeShape[i][j];
                }
            }
        }
        this.clearMovingMat();

    }

    isGameOver(currPiece) {
        for (let i = 0; i < 2; i++) {
            for (let j = 3; j < 3 + currPiece.activeShape.length; j++) {
                if (this.matrix[i][j][0] > 0) {
                    console.log('LOOSER');
                    return true;
                }
            }
        }

        return false;
    }

    clearRow() {
        // debugger
        console.log('clear Row function');
        let rows = 0;
        for (let r = 0; r < this.ROW; r++) {
            let isRowFull = true;
            for (let c = 0; c < this.COL; c++) {
                isRowFull = isRowFull && (this.matrix[r][c][0] !== 0);
            }
            if (isRowFull) {
                console.log('isRowFull ', rows);
                rows++;
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < this.COL; c++) {
                        this.matrix[y][c][0] = this.matrix[y - 1][c][0];
                    }
                }
                for (let c = 0; c < this.COL; c++) {
                    this.matrix[0][c][0] = 0;
                }
            }
        }
        console.log('rows is', rows);
        return rows;
    }



}