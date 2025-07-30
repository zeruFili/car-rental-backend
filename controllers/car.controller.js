const Car = require('../models/car.model'); // Adjust the path as necessary

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const files = req.files;
    console.log("Files:", files);

    

    const car = new Car({
      ...req.body,
      photos: files.map((file) => `${file.filename}`),
      owner: req.user._id,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
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
    
    const userId = req.user._id;
    
    if (!car.owner.equals(userId)) {
      return res.status(403).json({ message: 'You do not have permission to update this car' });
    }

    // Update car details
    Object.assign(car, req.body);

    // Handle photos - MODIFIED LOGIC
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => file.filename);
      
      // Check if we should keep existing photos
      if (req.body.keepExistingPhotos) {
        const existingPhotosToKeep = req.body.keepExistingPhotos.split(',').filter(p => p.trim() !== '');
        car.photos = [...existingPhotosToKeep, ...newPhotos]; // COMBINE instead of replace
      } else {
        car.photos = newPhotos; // Replace all if no existing photos to keep
      }
    }
    // If no new files but we have keepExistingPhotos, update accordingly
    else if (req.body.keepExistingPhotos) {
      const existingPhotosToKeep = req.body.keepExistingPhotos.split(',').filter(p => p.trim() !== '');
      car.photos = existingPhotosToKeep;
    }

    await car.save();

    res.status(200).json({
      message: 'Car updated successfully',
      car: car
    });
  } catch (error) {
    console.error(error);
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
    
    if (!car.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'You do not have permission to delete this car' });
    }

    // Use deleteOne to remove the car
    await Car.deleteOne({ _id: req.params.id });
    
    // Send a response indicating successful deletion
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
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


// Get cars by user ID
exports.getCarsByUserId = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user
    const cars = await Car.find({ owner: userId }); // Find cars owned by the user
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};