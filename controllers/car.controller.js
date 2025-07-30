const Car = require("../models/car.model") // Adjust the path as necessary

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const files = req.files
    console.log("Files:", files)

    const car = new Car({
      ...req.body,
      photos: files.map((file) => `${file.filename}`),
      owner: req.user._id,
    })

    await car.save()
    res.status(201).json(car)
  } catch (error) {
    res.status(400).json({ message: error.message })
    console.log(error)
  }
}

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
    res.status(200).json(cars)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }
    res.status(200).json(car)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a car - SIMPLIFIED AND IMPROVED
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    const userId = req.user._id

    if (!car.owner.equals(userId)) {
      return res.status(403).json({ message: "You do not have permission to update this car" })
    }

    // Update car details (make, model, year, pricePerDay, description)
    const { keepExistingPhotos, ...carDetails } = req.body
    Object.assign(car, carDetails)

    // Handle photos logic
    let finalPhotos = []

    // Step 1: Add existing photos to keep (if any)
    if (keepExistingPhotos) {
      const existingPhotosToKeep = keepExistingPhotos
        .split(",")
        .map((photo) => photo.trim())
        .filter((photo) => photo !== "")

      finalPhotos = [...existingPhotosToKeep]
      console.log("Keeping existing photos:", existingPhotosToKeep)
    }

    // Step 2: Add new uploaded photos (if any)
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.filename)
      finalPhotos = [...finalPhotos, ...newPhotos]
      console.log("Adding new photos:", newPhotos)
    }

    // Step 3: Update car photos
    if (finalPhotos.length > 0) {
      car.photos = finalPhotos
      console.log("Final photos array:", finalPhotos)
    } else {
      // If no photos provided at all, keep original photos
      console.log("No photo changes, keeping original photos")
    }

    await car.save()

    res.status(200).json({
      message: "Car updated successfully",
      car: car,
    })
  } catch (error) {
    console.error("Update car error:", error)
    res.status(400).json({ message: error.message })
  }
}

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    if (!car.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "You do not have permission to delete this car" })
    }

    // Use deleteOne to remove the car
    await Car.deleteOne({ _id: req.params.id })

    // Send a response indicating successful deletion
    res.status(200).json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error(error) // Log the error for debugging
    res.status(500).json({ message: error.message })
  }
}

// Update car status to pending (admin only)
exports.updateCarStatusToPending = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." })
    }

    // Update car status to pending
    car.availability = "pending"
    await car.save()
    res.status(200).json(car)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get cars by user ID
exports.getCarsByUserId = async (req, res) => {
  try {
    const userId = req.user._id // Get the user ID from the authenticated user
    const cars = await Car.find({ owner: userId }) // Find cars owned by the user
    res.status(200).json(cars)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
