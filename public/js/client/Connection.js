class Connection {
    constructor(tetrisManager) {
        this.tetrisManager = tetrisManager;
        this.local = this.tetrisManager.player[0];
        this.peers = new Map;
        this.sessionID = this.tetrisManager.sessionID;
    }

    connect(address) {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('Connection established');
            this.initSession();
            this.update();

        });

        this.conn.addEventListener('message', event => {
            console.log('Received message', event.data);
            this.receive(event.data);
        });
    }

    initSession() {
        const sessionID = this.tetrisManager.sessionID;
        const gameState = this.local.serialize();
        if (sessionID) {
            this.send({
                type: 'join-session',
                id: sessionID,
                gameState,
            });
        } else {
            this.send({
                type: 'create-session',
                gameState,
            });
        }

    }

    updateGameMode() {
        console.log("update game mode :connection: 33");
        if (this.tetrisManager.gameMode === 'MultiMode-create') {
            this.send({
                mode: 'Multi-create',
            });
        } else if (this.tetrisManager.gameMode === 'SinglMode') {
            this.send({
                mode: 'Single',
            });
        } else if (this.tetrisManager.gameMode === 'MultiMode-join') {
            this.send({
                mode: 'Multi-join',
                id: this.tetrisManager.sessionID,
            })
        }
    }

    update(time = 0) {
        this.send({
            type: 'state-update',
            gameState: this.local.serialize(),
            ClientId: this.tetrisManager.userID,
        });
    }

    send(data) {
        if (this.conn.readyState > 0) {
            const msg = JSON.stringify(data);
            console.log('Sending message', msg);
            this.conn.send(msg);
        }
    }

    receive(msg) {
        console.log('i am receiving');
        const data = JSON.parse(msg);
        if (data.type === 'session-created') {
            this.tetrisManager.sessionID = data.id;
            this.tetrisManager.userID = data.userID;

        } else if (data.type === 'session-broadcast') {
            console.log(data.type);
            // if (tetisManager.gameMode === 'multiplayer-mode') {
            console.log('receieving session broadcast');
            this.updateManager(data.peers);
            // }

        } else if (data.type === 'state-update') {
            console.log(data.type);
            // if (tetisManager.gameMode === 'multiplayer-mode') {
            this.tetrisManager.updatePlayer(data.ClientId, data.gameState);
            // }
        } else if (data.type === 'local-update') {
            this.update();
        } else if (data.type === 'mode-response') {
            console.log('mode response');
            if (data.startGame) {
                console.log("starting the Game");
                this.tetrisManager.startGame = true;
                console.log(this.tetrisManager.startGame);
            }
        } else if (data.type === 'player_out') {
            console.log('one Player out');
            this.tetrisManager.endGame = true;
        }
    }

    updateManager(peers) {
        const me = peers.you;
        this.tetrisManager.userID = me;
        console.log('update Manager in Connection : 109', peers);
        peers.clients.forEach(client => {
            if (client.id !== me) {
                if (!this.peers.has(client.id)) {
                    console.log('i am here in connection 156 , adding peers and updatin manager', client);
                    const tetris = this.tetrisManager.addPlayer(client.gameState.player.name, client.id);
                    tetris.deSerialize(client.gameState);
                    this.peers.set(client.id, tetris);
                }
            }

        });
    }



}