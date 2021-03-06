var express = require('express');
var passport = require('passport');
var UserAccount = require('../models/user-account');
var router = express.Router();

router.get('/', function (req, res) {
    if(req.user) {
        res.redirect('/users/' + encodeURIComponent(req.user.username) + '/todos/all');
    } else {
        res.render('login');
    }
});

router.get('/users/:username/todos/:var(all|incomplete|starred|done)?', function(req, res) {
    if(!req.user) return res.redirect('/');

    var viewedUsername = decodeURIComponent(req.params.username);
    var loggedInUsername = req.user.username;

    UserAccount.findOne({ username: viewedUsername }).exec(function(err, user) {
        if(err) {
            next(err);
        } else if(!user){
            return res.sendStatus(404);
        } else {
            var users = {
                loggedInUsername: loggedInUsername,
                viewedUsername: viewedUsername
            };

            return res.render('app', users);
        }
    });
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    UserAccount.register(new UserAccount({ username: req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error: err.message });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { username: (req.user || {}).username, error: req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
    req.session.save(function (err) {
        if(err) return next(err);

        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if(err) return next(err);

        res.redirect('/');
    });
});

module.exports = router;
