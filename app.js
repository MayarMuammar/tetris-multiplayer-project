const express = require('express');
const http = require('http');
const path = require('path');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const pug = require('pug');

const WebSocketServer = require('ws').Server;
const Session = require('./session');
const Client = require('./client');
const WSserver = new WebSocketServer({ port: 9000 });

const sessions = new Map;
console.log("Hello World !!");

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = http.createServer(app);

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//View Engine
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');



//bodyParser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Express Session 
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport
// app.use(passport.initialize());
// app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


//Connect Flash
app.use(flash());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.get('/init', function(req, res) {

});

//Define Routes
app.use('/', routes);
app.use('/users', users);

app.get('*', function(req, res, next) {
    console.log('this is req.user', req.session.user);
    res.locals.user = req.session.user || null;
    if (!res.locals.user) {
        res.redirect('/in');
    }
    // res.locals.gameID = req.session.gameID;
    console.log(res.locals);
    next();
});

server.listen(3000, function() {
    console.log(`Server started on port ${server.address().port} :)`);
});




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

WSserver.on('connection', conn => {
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

module.exports = app;