const joi = require('joi');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => { 
  const keys = Object.keys(schema);
  const object = keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key];
    }
    return obj;
  }, {});

  // Validate the schema
   const { value, error } = joi.compile(schema).validate(object); // Validate the entire object

  if (error) {
    const errors = error.details.map((detail) => detail.message).join(', '); // Collect error messages
    return next(new ApiError(400, errors)); // Pass the error to the next middleware
  }
  console.log("Validating object:", object);
  next(); // No errors, proceed to the next middleware
};

module.exports = validate;