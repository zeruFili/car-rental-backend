const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const CarService = require("../services/car.service"); // Adjust the path as necessary
const catchAsync = require("../utils/catchAsync"); // Adjust the path as necessary
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const Car = require("../models/car.model");
// Create a new car
// exports.createCar = catchAsync(async (req, res) => {
//   const car = await CarService.createCar(req.body, req.files, req.user._id);
//   res.status(201).json(car);
// });

// // Get all cars
// exports.getAllCars = catchAsync(async (req, res) => {
//   const cars = await CarService.getAllCars();
//   res.status(200).json(cars);
// });

exports.createCar = catchAsync(async (req, res) => {
  const carData = req.body;
  const ownerId = req.user._id;

  // Check if processed files are available
  if (!req.processedFiles || req.processedFiles.length === 0) {
    return res.status(500).json({
      message: 'No files were successfully processed.',
    });
  }

  const car = new Car({
    ...carData,
    photos: req.processedFiles, // Use processed file names
    owner: ownerId,
  });

  await car.save();
  res.status(201).json(car);
});

// Get all cars
exports.getAllCars = catchAsync(async (req, res) => {
    // 1. Fetch all cars from the database
    const cars = await Car.find();

    // 2. Determine the server base URL dynamically
    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;

    // 3. Process each car to replace photo filenames with full URLs
    const carsWithFullPhotoUrls = cars.map(car => {
        const carObject = car.toObject();
        carObject.photos = carObject.photos.map(filename => {
            return `${serverBaseUrl}/uploads/${filename}`;
        });
        return carObject;
    });

    // 4. Send the response
    res.status(httpStatus.default.OK).json({
        cars: carsWithFullPhotoUrls, // Your car data with specific photos
        message: 'Cars retrieved successfully.',
    });
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
   // 2. Determine the server base URL dynamically
    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;

    // 3. Process each car to replace photo filenames with full URLs
    const carsWithFullPhotoUrls = cars.map(car => {
        const carObject = car.toObject();
        carObject.photos = carObject.photos.map(filename => {
            return `${serverBaseUrl}/uploads/${filename}`;
        });
        return carObject;
    });
    console.log(carsWithFullPhotoUrls);

    // 4. Send the response
    res.status(httpStatus.default.OK).json({
        cars: carsWithFullPhotoUrls, // Your car data with specific photos
        message: 'Cars retrieved successfully.',
    });
 
});

