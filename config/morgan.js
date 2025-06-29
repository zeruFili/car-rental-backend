const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const config = require('./config'); // Adjust the path as necessary

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIPFormat = (req) => {
    return config.env === 'production' ? req.ip : 'remote-addr -';
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '..', 'logs/access.log'), // Adjust the path based on your structure
  { flags: 'a' } // Append mode
);

// const successResponseFormat = (tokens, req, res) => {
//   const userAgent = req.headers['user-agent'] || 'unknown'; // Default to 'unknown' if not present
//   return `${getIPFormat(req)} ${req.method} ${req.url} ${res.statusCode} ${res.responseTime} ms ${userAgent} ${new Date()}`;
// };
const successResponseFormat =`${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;

const successHandler = morgan(successResponseFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode >= 400,
});

// const errorResponseFormat = (err, req, res) => {
//   return `${getIPFormat(req)} ${req.method} ${req.url} ${err.status || res.statusCode} ${err.message} ${new Date()}`;
// };

const errorResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent  :date -error-message: :message`;
const errorHandlers = morgan(errorResponseFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400,
});

module.exports = { successHandler, errorHandlers };