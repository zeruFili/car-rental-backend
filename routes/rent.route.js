const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rent.controller'); 
const { protect, adminValidator } = require('../middleware/authMiddleware'); 
const validate = require("../middleware/validate"); 
const {
  createRentalSchema,
  getRentalByIdSchema,
  updateOwnerViewedStatusSchema,
  updateRenterViewedStatusSchema,
  getFutureRentalsForCarSchema
} = require("../validations/rental.validation");

router.post('/', protect, validate(createRentalSchema), rentalController.createRental);

router.get('/', protect, adminValidator, rentalController.getAllRentals);
router.get('/verify/:tx_ref', rentalController.verifyPayment);

router.get('/future', validate(getFutureRentalsForCarSchema), rentalController.getFutureRentalsForCar);

router.get('/owner', protect, rentalController.getRentalsByOwner);

router.get('/renter', protect, rentalController.getRentalsByRenter);

router.get('/:id', validate(getRentalByIdSchema), rentalController.getRentalById);

router.patch('/update-owner-viewed', protect, validate(updateOwnerViewedStatusSchema), rentalController.updateOwnerViewedStatus);

router.patch('/update-renter-viewed', protect, validate(updateRenterViewedStatusSchema), rentalController.updateRenterViewedStatus);

module.exports = router;