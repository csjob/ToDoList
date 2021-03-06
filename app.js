var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


//for database connection
var db = require('./config/connection');
//for session management
var session = require('express-session');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//for session management
app.use(session({secret: "key", cookie: {maxAge: 600000}}));

//calling databse function
db.connect((err)=>{
  if(err){
    console.log("Error in database connection"+err);
  }else{
    console.log("Database connected");
  }
});

//flash message middleware
app.use(function(req,res,next){ 
  res.locals.message = req.session.message;
  delete req.session.message;
  next(); 
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
