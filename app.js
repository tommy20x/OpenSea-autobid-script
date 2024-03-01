const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const errorhandler = require('errorhandler')
const mongoose = require('mongoose')

require('dotenv').config()
const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: '1b125380-e82d-4c6e-8e7774efae22-a468f652bb36',
  cookie: { maxAge: 60000 },
  resave: false, 
  saveUninitialized: false 
}));

if (!isProduction) {
  app.use(errorhandler());
}

mongoose.connect(process.env.MONGODB_URI).then(() => console.info('Mongodb connected'));
if (!isProduction) {
  mongoose.set('debug', true);
}

require('./models/collection');
require('./models/asset');
app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
const server = app.listen( process.env.PORT || 4000, function(){
  console.log('Listening on port ' + server.address().port);
});