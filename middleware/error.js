const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const logger = require('../config/logger');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) { 
  
    const statusCode =
      error.statusCode || 
      error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.default.INTERNAL_SERVER_ERROR;
      

    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode,  message, false,  error.stack);
  }
  next(error); // Pass the error to the next middleware
}; 
const errorHandler = (err, req, res, next) => {
  let { statusCode , message } = err; // Default status code to 500 if not set
  if(config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[statusCode];
  }
  const response = {
    error: true,
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }), // Spread operator for stack trace
  };

  res.locals.errorMessage = message;

  // Log the error only in development mode
  if (config.env === 'development') {
    logger.error(err); // Log the error
  }

  res.status(statusCode).send(response);
};



module.exports = {errorHandler,errorConverter};