const joi = require('joi');

const createRentalSchema = {
  body: joi.object().keys({
    carId: joi.string().required(), // Car ID is required
    startDate: joi.date().iso().required(), // Start date must be a valid ISO date
    endDate: joi.date().iso().greater(joi.ref('startDate')).required(), // End date must be after start date
  }),
};

// Schema for getting a rental by ID
const getRentalByIdSchema = {
  body: joi.object().keys({
    id: joi.string().required(), // Rental ID is required
  }),
};

// Schema for updating owner viewed status
const updateOwnerViewedStatusSchema = {
  body: joi.object().keys({
    rentalId: joi.string().required(), // Rental ID is required
  }),
};

// Schema for updating renter viewed status
const updateRenterViewedStatusSchema = {
  body: joi.object().keys({
    rentalId: joi.string().required(), // Rental ID is required
  }),
};

// Schema for getting future rentals for a car
const getFutureRentalsForCarSchema = {
  query: joi.object().keys({
    carId: joi.string().required(), // Car ID is required in the query parameters
  }),
};

module.exports = {
  createRentalSchema,
  getRentalByIdSchema,
  updateOwnerViewedStatusSchema,
  updateRenterViewedStatusSchema,
  getFutureRentalsForCarSchema
};