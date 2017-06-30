var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();
var app = express();
var multer = require('multer');
;
var constants = require('constants');
var constant = require('./config/constants');


var port = process.env.PORT || 80;
//var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var dateFormat = require('dateformat');
var now = new Date();
app.use(expressValidator());
app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./config/passport')(passport); // pass passport for configuration

//app.use(expressValidator);
//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, '../frontend/'), {
    etag: false
}));
app.use(express.static(path.join(__dirname, '../upload_files/video/videos/'), {
    etag: false
}));
app.use(express.static(path.join(__dirname, '../upload_files/'), {
    etag: false
}));

//required for passport
//app.use(session({ secret: 'iloveyoudear...' })); // session secret

app.use(session({secret: 'zomaareenstukjetekstDatjenietzomaarbedenkt'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    // res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

app.use(function (req, res, next) {
    // res.status(500).render('404', {title: "Sorry, page not found"});
});
//exports = module.exports = app;