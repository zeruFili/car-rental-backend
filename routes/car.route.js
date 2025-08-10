const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller'); 
const { protect } = require('../middleware/authMiddleware'); 
const { uploadFileMiddleware } = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validate"); 
const {
  createCarSchema,
  updateCarSchema,
  deleteCarSchema,
  updateCarStatusToPendingSchema,
  getCarByIdSchema,
} = require("../validations/car.validation"); 

// router.post('/', protect, uploadFileMiddleware, validate(createCarSchema), carController.createCar);
router.post('/', protect, uploadFileMiddleware, validate(createCarSchema), carController.createCar);
router.put('/:id', protect, uploadFileMiddleware, validate(updateCarSchema), carController.updateCar);
router.put('/status/:id', protect, validate(updateCarStatusToPendingSchema), carController.updateCarStatusToPending);
router.delete('/:id', protect, validate(deleteCarSchema), carController.deleteCar);
router.get('/', carController.getAllCars);
router.get('/user', protect, carController.getCarsByUserId);

router.get('/:id', validate(getCarByIdSchema), carController.getCarById);
module.exports = router;