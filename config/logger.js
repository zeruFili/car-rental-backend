const winston = require('winston');
const { createLogger, transports, format } = winston;
const config = require('./config'); // Adjust the path as necessary

const { combine, timestamp, printf, colorize, uncolorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp(),
    config.env === 'development' ? colorize() : uncolorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;