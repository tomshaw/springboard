var express = require('express')
  , jade = require('jade')
  , stylus = require('stylus')
  , nib = require('nib')
  , path = require('path')
  , moment = require('moment')
  , port = process.env.PORT || 3000
  , users = require('./data/users').data;

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path).use(nib());
}

app.configure(function () {
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(app.router);
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        secret: 'secretcodehere'
    }));
    app.use(express.methodOverride());
    app.use(stylus.middleware({
        src: __dirname + '/public',
        dest: __dirname + '/public',
        compile: compile
    }));
    app.use(express.static(__dirname + '/public'));
});

app.locals({
    title: "Springboard - Express Jade Stylus Boilerplate",
    description: "Tom Shaw is a web developer and designer based in Dallas Texas.",
    keywords: "tom shaw, web design, web development, designer, developer, backbone.js, node.js, zend framework, require.js, grunt.js, phantom.js, jslint, jshint",
    version: '0.0.1',
    formatDate: function (val) {
        var date = moment(val);
        return date.format("MMMM Do YYYY, h:mm a");
    }
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login/login', {
        user: {}
    });
});

app.get('/grid', function (req, res) {
    res.render('table/grid', {
        pageheader: 'Table Data Listing',
        pagedescription: 'Some simple tables.',
        items: users
    });
});

app.use(function (req, res, next) {
    res.render('404', {
        status: 404,
        url: req.url
    });
});

app.use(function (err, req, res, next) {
    res.render('500', {
        status: err.status || 500,
        error: err
    });
});

app.listen(port);

console.log('Welcome to Springboard!\nServer started at: http://localhost:' + port);