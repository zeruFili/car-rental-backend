const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rent.controller'); // Adjust the path as necessary
const { protect, adminValidator } = require('../middleware/authMiddleware'); // Middleware to protect routes

// Create a new rental record
router.post('/', protect, rentalController.createRental);

// View all rentals (admin only)
router.get('/', protect, adminValidator, rentalController.getAllRentals);


router.get('/future',  rentalController.getFutureRentalsForCar);

// Get rentals by the owner
router.get('/owner', protect, rentalController.getRentalsByOwner);

// Get rentals by the renter
router.get('/renter', protect, rentalController.getRentalsByRenter);

// Get a rental by ID
// router.get('/future/:id', protect, rentalController.getRentalById);

// Get future rentals for a specific car
router.get('/future', protect, rentalController.getFutureRentalsForCar);

module.exports = router;