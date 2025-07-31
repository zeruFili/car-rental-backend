const CarService = require("../services/car.service"); // Adjust the path as necessary
const catchAsync = require("../utils/catchAsync"); // Adjust the path as necessary

// Create a new car
exports.createCar = catchAsync(async (req, res) => {
  const car = await CarService.createCar(req.body, req.files, req.user._id);
  res.status(201).json(car);
});

// Get all cars
exports.getAllCars = catchAsync(async (req, res) => {
  const cars = await CarService.getAllCars();
  res.status(200).json(cars);
});

// Get a car by ID
exports.getCarById = catchAsync(async (req, res) => {
  const car = await CarService.getCarById(req.params.id);
  res.status(200).json(car);
});

// Update a car
exports.updateCar = catchAsync(async (req, res) => {
  const car = await CarService.updateCar(req.params.id, req.body, req.files, req.user._id);
  res.status(200).json({ message: "Car updated successfully", car });
});

// Delete a car
exports.deleteCar = catchAsync(async (req, res) => {
  await CarService.deleteCar(req.params.id, req.user._id);
  res.status(200).json({ message: "Car deleted successfully" });
});

// Update car status to pending (admin only)
exports.updateCarStatusToPending = catchAsync(async (req, res) => {
  const car = await CarService.updateCarStatusToPending(req.params.id, req.user.role);
  res.status(200).json(car);
});

// Get cars by user ID
exports.getCarsByUserId = catchAsync(async (req, res) => {
  const cars = await CarService.getCarsByUserId(req.user._id);
  res.status(200).json(cars);
});