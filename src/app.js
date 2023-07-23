const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//const moment = require('moment');
const logger = require('morgan');
require('dotenv').config({path: path.resolve(__dirname,'./env/developement.env')});
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const insertRouter = require('./routes/insert');
const logoutRouter = require('./routes/logout');
const employeeRouter = require('./routes/employee');
const prodPocketRouter = require('./routes/prodPocket');
const pdfGen = require('./routes/pdfGenerator');
//const calendarRouter = require('./routes/calendario');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//permette di inviare username al client
app.use(function(req, res, next) {
  res.locals.nomeUtente = req.cookies.nome || '';
  next();
});


app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/login', loginRouter);
app.use('/', insertRouter);
app.use('/logout', logoutRouter);
app.use('/', employeeRouter);
app.use('/', prodPocketRouter);
app.use('/dipendenti', prodPocketRouter);
app.use('/', pdfGen);
//app.use('/calendario', calendarRouter);


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
