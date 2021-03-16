const WebSocketServer = require('ws').Server;
const Session = require('./session');
const Client = require('./client');

const server = new WebSocketServer({ port: 9000 });

const sessions = new Map;
console.log("Hello World !!");

function createId(len = 6, chars = 'abcdefghjkmnopqrstvwxyz01234567890') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

function createClient(conn, id = createId()) {
    return new Client(conn, id);
}

function createSession(id = createId()) {
    if (sessions.has(id)) {
        throw new Error(`Session ${id} already exists`);
    }

    const session = new Session(id);
    console.log('Creating session', session);

    sessions.set(id, session);

    return session;
}

function getSession(id) {
    return sessions.get(id);
}

function propagateSession(session) {
    const clients = [...session.clients];
    clients.forEach(client => {
        client.send({
            type: 'session-broadcast',
            peers: {
                you: client.id,
                clients: clients.map(client => {
                    return {
                        id: client.id,
                        gameState: client.state,
                    }
                }),
            },
        });
    });
}

server.on('connection', conn => {
    console.log('Connection established');
    const client = createClient(conn);

    conn.on('message', msg => {
        console.log('Message received', msg);
        const data = JSON.parse(msg);

        if (data.type === 'create-session') {
            const session = createSession();
            session.ClientIn(client);

            client.state = data.gameState;
            client.send({
                type: 'session-created',
                id: session.id,
                userID: client.id,
            });
        } else if (data.type === 'join-session') {
            const session = getSession(data.id) || createSession(data.id);
            session.ClientIn(client);

            client.state = data.gameState;
            propagateSession(session);
        } else if (data.type === 'state-update') {
            client.propagate(data);
        } else if (data.type === 'player_out') {
            client.propagate(data);
        }
    });

    conn.on('close', () => {
        console.log('Connection closed');
        const session = client.session;
        if (session) {
            session.ClientOut(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
        }

        propagateSession(session);

        console.log(sessions);
    });
});