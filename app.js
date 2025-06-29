const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const config = require('./config/config');
const app = require('./server'); // Import the app from app.js
const logger = require('./config/logger');

// Connect to the database
mongoose.connect(config.dbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Database connected'))
  .catch(err => {
    logger.error('Database connection error:', err);
    process.exit(1); // Exit the process on connection error
  });

const PORT = config.port;

// Create HTTP server
const httpServer = http.createServer(app);
const server = httpServer.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1); 
  }
};

const unExpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', unExpectedErrorHandler);
process.on('unhandledRejection', unExpectedErrorHandler);

// Handle SIGTERM signal for graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close(() => {
      logger.info('Server closed gracefully');
      process.exit(0); // Exit the process
    });
  }
})