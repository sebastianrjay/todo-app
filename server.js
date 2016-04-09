var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mainRoutes = require('./routes/main');
var todosAPIRoutes = require('./routes/todos-api');
var app = express();

// view engine and static asset setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/partials', express.static(__dirname + '/views/partials'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/javascripts', express.static(__dirname + '/public/javascripts'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// routes config
app.use('/', mainRoutes);
app.use('/api', todosAPIRoutes);

// passport config
var UserAccount = require('./models/user-account');
passport.use(new LocalStrategy(UserAccount.authenticate()));
passport.serializeUser(UserAccount.serializeUser());
passport.deserializeUser(UserAccount.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/todo_app');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
