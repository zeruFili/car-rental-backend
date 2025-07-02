const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rent.controller'); // Adjust the path as necessary
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

// Create a new rental record
router.post('/', protect, rentalController.createRental);

// View all rentals
router.get('/', protect, rentalController.getAllRentals);

// Get a rental by ID
router.get('/:id', protect, rentalController.getRentalById);

// Update rental status
router.put('/:id/status', protect, rentalController.updateRentalStatus);

// Additional routes for deleting rentals can be added here

module.exports = router;