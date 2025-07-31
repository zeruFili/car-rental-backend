const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rent.controller'); 
const { protect, adminValidator } = require('../middleware/authMiddleware'); 
const validate = require("../middleware/validate"); 
const {
  createRentalSchema,
  getRentalByIdSchema,
  updateViewedStatusSchema,
  getFutureRentalsForCarSchema
} = require("../validations/rental.validation"); 

router.post('/', protect, validate(createRentalSchema), rentalController.createRental);

router.get('/', protect, adminValidator, rentalController.getAllRentals);

router.get('/future', validate(getFutureRentalsForCarSchema), rentalController.getFutureRentalsForCar);

router.get('/owner', protect, rentalController.getRentalsByOwner);

router.get('/renter', protect, rentalController.getRentalsByRenter);

router.get('/:id', validate(getRentalByIdSchema), rentalController.getRentalById);

router.patch('/updateview', protect, validate(updateViewedStatusSchema), rentalController.updateViewedStatus);

module.exports = router;