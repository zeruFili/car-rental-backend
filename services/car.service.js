const Car = require("../models/car.model"); // Adjust the path as necessary

// Create a new car
exports.createCar = async (carData, files, ownerId) => {
  const car = new Car({
    ...carData,
    photos: files.map((file) => `${file.filename}`),
    owner: ownerId,
  });

  await car.save();
  return car;
};

// Get all cars
exports.getAllCars = async () => {
  return await Car.find();
};

// Get a car by ID
exports.getCarById = async (carId) => {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found");
  }
  return car;
};

// Update a car
exports.updateCar = async (carId, carDetails, files, userId) => {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found");
  }

  if (!car.owner.equals(userId)) {
    throw new Error("You do not have permission to update this car");
  }

  Object.assign(car, carDetails);

  let finalPhotos = [];
  if (carDetails.keepExistingPhotos) {
    const existingPhotosToKeep = carDetails.keepExistingPhotos.split(",").map((photo) => photo.trim()).filter((photo) => photo !== "");
    finalPhotos = [...existingPhotosToKeep];
  }

  if (files && files.length > 0) {
    const newPhotos = files.map((file) => file.filename);
    finalPhotos = [...finalPhotos, ...newPhotos];
  }

  car.photos = finalPhotos.length > 0 ? finalPhotos : car.photos;
  await car.save();
  return car;
};

// Delete a car
exports.deleteCar = async (carId, userId) => {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found");
  }

  if (!car.owner.equals(userId)) {
    throw new Error("You do not have permission to delete this car");
  }

  await Car.deleteOne({ _id: carId });
};

// Update car status to pending (admin only)
exports.updateCarStatusToPending = async (carId, userRole) => {
  if (userRole !== "admin") {
    throw new Error("Access denied. Admins only.");
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found");
  }

  car.availability = "pending";
  await car.save();
  return car;
};

// Get cars by user ID
exports.getCarsByUserId = async (userId) => {
  return await Car.find({ owner: userId });
};