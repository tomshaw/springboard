var express = require('express'),
    jade = require('jade'),
    stylus = require('stylus'),
    app = module.exports = express.createServer();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('force', true)
    .set('compress', false);
}

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.methodOverride());
  app.use(stylus.middleware({ 
      src: __dirname + '/views/styles'
    , dest: __dirname + '/public/stylesheets'
    , compile: compile
  }));
  app.use(express.static(__dirname + '/public/stylesheets'));
});

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/login', function(req, res){
  res.render('form/login.jade', {
    locals: { user: {} }
  });
});

app.get('/register', function(req, res){
  res.render('form/register.jade', {
    locals: { user: {} }
  });
});

app.get('/table', function(req, res){
  var data = { 0: {
      name: "Tom Shaw"
    , text: "Node Rocks Your World"
    , created: new Date()
    }, 1: {
      name: "Bruce Lee"
    , text: "I like Node.js because it's simple to use!"
    , created: new Date()
  }}
  res.render('table/data.jade', {
    locals: { title: 'Table Data Listing', description: 'Some simple tables.', items: data }
  });
});

app.listen(3000);
console.log('server listening on port 3000');