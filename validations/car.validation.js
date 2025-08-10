const joi = require('joi');

// Schema for creating a new car
const createCarSchema = {
  body: joi.object().keys({
    make: joi.string().min(1).required(), // Car make is required
    model: joi.string().min(1).required(), // Car model is required
    year: joi.number().integer().min(1886).required(), // Year must be a valid year
    pricePerDay: joi.number().positive().required(), // Price per day must be a positive number
    description: joi.string().optional(), // Description is optional
    // Additional fields can be added here as needed
  }),
};

// Schema for getting a car by ID
const getCarByIdSchema = {
  params: joi.object().keys({
    id: joi.string().required(), // Car ID is required
  }),
};

// Schema for updating a car
const updateCarSchema = {
  params: joi.object().keys({
    id: joi.string().required(), // Car ID is required
  }),
  body: joi.object().keys({
    make: joi.string().min(1).optional(), // Car make is optional for update
    model: joi.string().min(1).optional(), // Car model is optional for update
    year: joi.number().integer().min(1886).optional(), // Year must be a valid year
    pricePerDay: joi.number().positive().optional(), // Price per day must be a positive number
    description: joi.string().optional(), // Description is optional
    keepExistingPhotos: joi.string().optional(),
    // Additional fields can be added here as needed
  }).min(1), // At least one field must be provided for update
};

// Schema for deleting a car
const deleteCarSchema = {
  params: joi.object().keys({
    id: joi.string().required(), // Car ID is required
  }),
};

// Schema for updating car status to pending (admin only)
const updateCarStatusToPendingSchema = {
  params: joi.object().keys({
    id: joi.string().required(), // Car ID is required
  }),
};

// Schema for getting cars by user ID (no specific body needed)
const getCarsByUserIdSchema = {
  // No specific validation needed as it relies on authenticated user ID
};

module.exports = {
  createCarSchema,
  getCarByIdSchema,
  updateCarSchema,
  deleteCarSchema,
  updateCarStatusToPendingSchema,
  getCarsByUserIdSchema,
};

