var mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* connect to database */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dbpatients', {useNewUrlParser:true});
require('./models/Patients');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const paginate = require('express-paginate');
var Patients = require("./models/Patients");
app.use(paginate.middleware(5, 10));

app.get('/patients', async (req, res, next) => {

  try {

    const [results, itemCount] = await Promise.all([
      Patients.find({}).limit(req.query.limit).sort({ _id: -1 }).skip(req.skip).lean().exec(),
      Patients.count({})
    ]);
    // console.log(results, itemCount)
    const pageCount = Math.ceil(itemCount / req.query.limit);

    res.render('patients', {
      patientlist: results,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });

  } catch (err) {
    next(err);
  }

});

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
