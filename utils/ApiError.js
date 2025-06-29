class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    
    if (stack) {
      this.stack = stack; // Set the stack trace if provided
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }

    this.statusCode = statusCode; // Set the HTTP status code
    this.isOperational = isOperational; // Indicate if the error is operational
  }
}

module.exports = ApiError; // Export the ApiError class