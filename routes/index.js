var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/game', function(req, res) {
    res.render('game');
});

router.get('/info', function(req, res) {
    res.render('info');
});

router.get('/gamerules', function(req, res) {
    res.render('gamerules');
});

router.get('/singlegame', function(req, res) {
    res.render('singlegame');
});

router.get('/multigame', function(req, res) {
    res.locals.user = req.session.user;
    res.render('multigame');
});

router.post('/singlegame', function(req, res) {
    res.locals.user = req.session.user;
    console.log(res.locals);
    res.render('singlegame');
});

router.post('/join', function(req, res) {
    let user = res.locals.user = req.session.user;
    console.log('user is ', user);
    console.log('this is gameid', req.body.gid);
    req.session.user.gameID = req.body.gid;
    // res.locals.gameID = req.body.gid;
    res.redirect('/multigame');
});

// router.get('/initConnection',function())

// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/users/login');
// }

module.exports = router;