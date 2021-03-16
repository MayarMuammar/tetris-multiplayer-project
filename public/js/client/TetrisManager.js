class TetrisManager {
    constructor(document, gameMode) {
        this.player = [];
        this.gameMode = gameMode;
        this.document = document;
        this.sessionID = undefined;
        this.userID = undefined;
        this.startGame = null;
        this.sound = new Sound('multimedia/a.mp3', this.document);
        this.gameoverSound = new Sound('multimedia/GameOver.mp3', this.document);
        this.endGame = false;
        this.playerName = this.document.getElementById("name").innerHTML;
        this.TopScore = 10;
        // this.scoreE = this.document.getElementById('score');

    }

    main() {
        this.tetris = this.document.getElementById('tetris');
        this.local = this.player[0] = new Tetris(this.playerName);
        this.setCanvas();
        this.connection = new Connection(this);
        this.connection.connect('ws://localhost:9000');
        window.CONTROL = this.local.game.CONTROL.bind(this.local.game);
        this.document.addEventListener("keydown", function(ev) { window.CONTROL(ev); });
        const colors = ["white", "red", "green", "yellow", "blue", "purple", "black", "orange"];
        this.sound.play();
        let sOFF = false;
        // this.name = this.document.getElementById("username");
        this.score = this.document.getElementById("score");
        this.bonus = this.document.getElementById("bonus");
        this.level = this.document.getElementById("level");
        if (this.gameMode === 'multigame') {
            this.sessionID = this.document.getElementById("gid").innerHTML || undefined;
            this.user1 = this.document.getElementById('user1');
            this.score1 = this.document.getElementById('score1');
            this.user2 = this.document.getElementById('user2');
            this.score2 = this.document.getElementById('score2');
            this.user3 = this.document.getElementById('user3');
            this.score3 = this.document.getElementById('score3');
            this.tetris1 = this.document.getElementById('tetris1');
            this.tetris2 = this.document.getElementById('tetris2');
            this.tetris3 = this.document.getElementById('tetris3');

            this.first = this.document.getElementById('first');
            this.second = this.document.getElementById('second');
            this.third = this.document.getElementById('third');
            this.fourth = this.document.getElementById('fourth');

            this.startSign = 0;
            window.ShowAll = this.ShowAll.bind(this);
            this.IntervalID = setInterval(function() { window.ShowAll(); }, this.local.game.dropInterval);
            this.document.getElementById("left").addEventListener("click", () => {
                this.local.game.controller.moveLeft();
            });
            this.document.getElementById("right").addEventListener("click", () => {
                this.local.game.controller.moveRight();
            });
            this.document.getElementById("rotate").addEventListener("click", () => {
                this.local.game.controller.Rotate();
            });
            this.document.getElementById("down").addEventListener("click", () => {
                this.local.game.controller.moveDown();
            });
            this.document.getElementById("exit").addEventListener("click", () => {
                this.local.game.pause();
            });
            this.document.getElementById("continue").addEventListener("click", () => {
                this.local.game.start();
            });
        }

        if (this.gameMode === 'singlegame') {
            this.startSign = 1;
            window.show = this.show.bind(this);
            this.IntervalID = setInterval(function() { window.show(); }, this.local.game.dropInterval);
            this.local.game.start();
            this.document.getElementById("left").addEventListener("click", () => {
                this.local.game.controller.moveLeft();
            });
            this.document.getElementById("right").addEventListener("click", () => {
                this.local.game.controller.moveRight();
            });
            this.document.getElementById("rotate").addEventListener("click", () => {
                this.local.game.controller.Rotate();
            });
            this.document.getElementById("down").addEventListener("click", () => {
                this.local.game.controller.moveDown();
            });
            this.document.getElementById("pause").addEventListener("click", () => {
                this.local.game.pause();
            });
            this.document.getElementById("continue").addEventListener("click", () => {
                this.local.game.start();
            });
        }
    }

    ShowAll() {

        this.local.deSerialize(this.local.serialize());
        this.local.draw(120, 20);
        this.local.drawNext();
        if (this.player.length === 4) {
            this.player[1].draw(0, 0);
            this.player[2].draw(0, 0);
            this.player[3].draw(0, 0);
            this.user1.innerHTML = this.player[1].player.name;
            this.score1.innerHTML = this.player[1].player.score;

            this.user2.innerHTML = this.player[2].player.name;
            this.score2.innerHTML = this.player[2].player.score;

            this.user3.innerHTML = this.player[3].player.name;
            this.score3.innerHTML = this.player[3].player.score;
            this.startSign++;

        } else {
            console.log('waiting for other players to join');
        }

        if (this.startSign === 1) {
            console.log('STARTING LOCALLY');
            this.local.game.start();
        }

        if (!this.local.game.over) {
            this.connection.update();
        } else {
            let out = {
                type: 'player_out',
            }
            this.connection.send(out);
            this.endGame = false;
            $(".endofround").show();
        }
        if (this.endGame) {
            clearInterval(this.IntervalID);
            $(".endofround").show();
            this.endOFRound();

        }

        if (this.local.game.player.score === this.TopScore) {
            let out = {
                type: 'player_out',
            }
            this.connection.send(out);
            this.endGame = false;
            this.local.game.pause();
            $(".endofround").show();
            this.endOFRound();
        }

        if (this.startSign > 1 && this.player.length < 4) {
            let out = {
                type: 'player_out',
            };
            this.connection.send(out);
            this.local.game.pause();
            this.endGame = true;
            $(".endofround").show();
            this.endOFRound();

        }

        this.score.innerHTML = this.local.game.player.score;
        this.bonus.innerHTML = this.local.game.player.bonusCount;
        this.level.innerHTML = this.local.game.player.level;

    }

    endOFRound() {
        let p0 = this.player[0].player;
        let p1 = this.player[1].player;
        let p2 = this.player[2].player;
        let p3 = this.player[3].player;
        let players = [p0, p1, p2, p3];

        players.sort((a, b) => b.score - a.score);
        console.log(players);

        this.first.innerHTML = players[0].name + '   |   ' + players[0].score;
        this.second.innerHTML = players[1].name + '   |   ' + players[1].score;
        this.third.innerHTML = players[2].name + '   |   ' + players[2].score;;
        this.fourth.innerHTML = players[3].name + '   |   ' + players[3].score;;
    }

    show() {
        this.local.deSerialize(this.local.serialize());
        this.local.draw(120, 20);
        this.local.drawNext();
        this.local.drawHold();
        if (this.local.game.over) {
            this.sound.stop();
            this.gameoverSound.play();
            this.local.game.over = false;
        }
        this.score.innerHTML = this.local.game.player.score;
        this.bonus.innerHTML = this.local.game.player.bonusCount;
        this.level.innerHTML = this.local.game.player.level;
        this.document.getElementById("gameover").innerHTML = "      " + this.local.game.player.score;
    }

    updateManager(players) {
        // console.log('in UpdateManager in Tetris Manager : 20');
        players.forEach(p => {
            // console.log('in uptaing manager : 23', p);
            this.player.push(new Tetris(p.gameState.player.name, p.id));
            // console.log('push update manager 25', this.player);
            this.player[(this.player.length - 1)].deSerialize(p.gameState);
        });
    }

    updatePlayer(id, data) {
        console.log('updating player');
        this.player.forEach(p => {
            if (p.userID === id) {
                p.deSerialize(data);
            }
        });
    }


    setGameMode(gameMode) {
        if (!arguments[1]) {
            this.gameMode = gameMode;
        } else {
            this.gameMode = gameMode;
            this.sessionID = arguments[1];
        }
    }

    addPlayer(name, id) {
        const tetris = new Tetris(name, id);
        this.player.push(tetris);
        this.setCanvas();
        return tetris;
    }

    setCanvas() {
        let index = this.player.length - 1;
        if (index === 0) {
            this.player[index].setCanvas(this.tetris, 20);
        }
        if (index === 1) {
            this.player[index].setCanvas(this.tetris1, 10);
        }
        if (index === 2) {
            this.player[index].setCanvas(this.tetris2, 10);
        }
        if (index === 3) {
            this.player[index].setCanvas(this.tetris3, 10);
        }
    }




}