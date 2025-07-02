const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const authRouter = require('./routes/auth.route');
const carRouter = require('./routes/car.route');
const rentRouter = require('./routes/rent.route');
const { errorHandler, errorConverter } = require('./middleware/error'); // Adjust the path as necessary
const ApiError = require('./utils/ApiError'); // Adjust the path as necessary
const httpStatus = require('http-status');
const { successHandler, errorHandlers } = require('./config/morgan');  
const cookieParser = require("cookie-parser");

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

app.use(successHandler);
app.use(errorHandlers);

// Middleware to parse JSON
app.use(express.json());

app.use(cookieParser());

// Define API routes
app.use('/api/user', authRouter);
app.use('/api/cars', carRouter);
app.use('/api/rent', rentRouter);

// Handle unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

module.exports = app; // Export the app for use in other files