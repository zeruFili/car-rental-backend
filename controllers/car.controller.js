const Car = require('../models/Car'); // Adjust the path as necessary

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const car = new Car({
      ...req.body,
      owner: req.user._id, // Associate the user ID with the car
    });
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.owner.equals(req.user._id)) { // Check ownership
      return res.status(403).json({ message: 'You do not have permission to update this car' });
    }

    // Update car details
    Object.assign(car, req.body);
    await car.save();
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.owner.equals(req.user._id)) { // Check ownership
      return res.status(403).json({ message: 'You do not have permission to delete this car' });
    }

    await car.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update car status to pending (admin only)
exports.updateCarStatusToPending = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Update car status to pending
    car.availability = 'pending';
    await car.save();

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};