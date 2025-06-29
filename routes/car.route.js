const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController'); // Adjust the path as necessary
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const { uploadFileMiddleware } = require("./uploadMiddleware");

// Create a new car record
router.post('/', protect, uploadFileMiddleware, carController.createCar);

// Update an existing car record
router.put('/:id', protect, uploadFileMiddleware, carController.updateCar);

// Update car status to pending (admin only)
router.put('/:id/status/pending', protect, carController.updateCarStatusToPending);

// Delete a car record
router.delete('/:id', protect, carController.deleteCar);

// View all cars
router.get('/', protect, carController.getAllCars);

// Get a car by ID
router.get('/:id', protect, carController.getCarById);

module.exports = router;