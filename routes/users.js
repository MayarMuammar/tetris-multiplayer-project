var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const { static } = require('express');
const app = require('../app');
var LocalStrategy = require('passport-local').Strategy;
// var WS = require('WSserver');

// router.use(express.static(path.join(__dirname, 'routes')));


router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/register', function(req, res) {
    res.render('register');
});
router.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let accounts = [];
    let user = {
        username,
        name: null,
        game: null
    }

    let data = fs.readFileSync(path.join(__dirname + '/users.json')).toString();
    // if (data !== '') {
    accounts = JSON.parse(data);
    // }

    let exist = false,
        isPassword = false;
    accounts.forEach(account => {
        if (account.username === username) {
            exist = true;
            user.username = username;
            user.name = account.name;
            user.game = account.game;
            if (account.password === password) {
                isPassword = true;
            }
        }
    });
    // console.log(exist);
    if (!exist) {
        res.render('login', {
            msg: `${username} does not exist, try register`,
            username: username
        });
    }
    if (exist && isPassword) {
        req.flash('success', 'You have logged in successfully');
        // // console.log('hello there');
        // req.user = user;
        req.session.user = user;
        console.log('this is req sesssion user', user);
        // res.json(user);
        res.location('/');
        res.redirect('/game');
        // res.render('initConnection', user);
    }
    if (exist && !isPassword) {
        res.render('login', {
            msg: `PASSWORD IS NOT CORRECT`,
            username: username
        });
    }
});

router.post('/register', function(req, res) {
    let username = req.body.username;
    let name = req.body.name;
    let password = req.body.password;
    let accounts = [];

    let newAccount = {
        username: username,
        name: name,
        game: null,
        password: password
    };
    let data = fs.readFileSync(path.join(__dirname + '/users.json')).toString();
    if (data !== '') {
        accounts = JSON.parse(data);
        // console.log('file of usrs have been read');
    }

    let exist = false;
    accounts.forEach(account => {
        if (account.username === newAccount.username) {
            exist = true;
        }
    });
    if (!exist) {
        // bcrypt.genSalt(10, function(err, salt) {
        //     bcrypt.hash(newAccount.password, salt, function(err, hash) {
        //         newAccount.password = hash;

        //         accounts.push(newAccount);
        //         data = JSON.stringify(accounts);
        //         fs.writeFileSync(path.join(__dirname + '/users.json'), data);
        //         res.location('/users');
        //         res.redirect('/users/login');
        //     });
        // });
        accounts.push(newAccount);
        data = JSON.stringify(accounts);
        fs.writeFileSync(path.join(__dirname + '/users.json'), data);
        res.location('/users');
        res.redirect('/users/login');


    } else {
        res.render('register', {
            msg: `THE USERNAME {${username}} IS NOT AVAILABLE`,
            name: name
        });
    }

});

// passport.serializeUser(function(user, done) {
//     done(null, user.username);
// });

// passport.deserializeUser(function(username, done) {
//     let accounts = [];
//     let data = fs.readFile(path.join(__dirname + '/users.json'), function(err) {
//         done(err);
//     }).toString();

//     if (data !== '') {
//         accounts = JSON.parse(data);
//     }
//     let exist = false;
//     let user;
//     accounts.forEach(account => {
//         if (account.username === username) {
//             user = account;
//             exist = true;
//         }
//     });
//     if (exist) {
//         done(err, user);
//     }
// });

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         let accounts = [];
//         let data = fs.readFile(path.join(__dirname + '/users.json'), function(err) {
//             if (err) {
//                 return done(err);
//             }
//         }).toString();
//         if (data !== '') {
//             accounts = JSON.parse(data);
//             console.log(accounts);
//         }

//         let exist = false;

//         let user = {
//             username,
//             password
//         };

//         accounts.forEach(account => {
//             if (account.username === username) {
//                 console.log(account.username);
//                 user = account;
//                 exist = true;
//             }
//         });

//         if (!exist) {
//             return done(null, false, { message: 'Incorrect username' });
//         }

//         bcrypt.compare(password, user.password, function(err, isMatch) {
//             if (err) {
//                 return done(err);
//             }
//             if (isMatch) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: 'Incorrect password' });
//             }
//         });
//     }
// ));

// router.post('/login',
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/users/login',
//         failureFlash: 'Invalid Username Or Password'
//     }),
//     function(req, res) {
//         console.log('Auth successful');
//         res.redirect('/');
//     });

module.exports = router;