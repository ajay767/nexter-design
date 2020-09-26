/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRoute = require('./routes/userRoute');
const hotelRouter = require('./routes/hotelRoute');
const viewRouter = require('./routes/viewRoute');
const reviewRouter = require('./routes/reviewRoute');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/AppError');

const app = express();

//set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit the numbers of request from same IP (API)
const limiter = rateLimit({
  max: 250,
  windowMs: 5 * 60 * 60 * 1000,
  message: 'Too many requests. please try after sometime!'
});
app.use('/api', limiter);

//body parser--
app.use(express.json());

//Data sanitization against NoSQl query injection
app.use(mongoSanitize());

//Data santization against XSS
app.use(xss());
//view engine setup--EJS
app.set('view engine', 'ejs');

//public directory setup (serving static files)
app.use(express.static(path.join(__dirname, './public')));

//view directory setup
app.set('views', path.join(__dirname, './views'));

//routes
app.use('/', viewRouter);

//api router
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/hotel', hotelRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
