const express = require('express');
const app = express();
const authRouter = require('./routes/auth.route');
const { errorHandler, errorConverter } = require('./middleware/error'); // Adjust the path as necessary
const ApiError = require('./utils/ApiError'); // Adjust the path as necessary
const httpStatus = require('http-status');
const {successHandler, errorHandlers} = require('./config/morgan');  

app.use(successHandler);
app.use(errorHandlers);

// Middleware to parse JSON
app.use(express.json());

// Define API routes
app.use('/api/auth', authRouter);



// Handle unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.default.NOT_FOUND, 'Not found'));
});

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

module.exports = app; // Export the app for use in other files