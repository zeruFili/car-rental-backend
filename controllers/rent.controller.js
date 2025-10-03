const RentalService = require("../services/rental.service"); // Adjust the path as necessary
const catchAsync = require("../utils/catchAsync"); // Adjust the path as necessary

// Create a rental
exports.createRental = catchAsync(async (req, res) => {
  const { carId, startDate, endDate } = req.body; // Take rental details from the request body
  const userId = req.user._id; // Get user ID from the request

  if (!carId) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  const rental = await RentalService.createRental(carId, startDate, endDate, userId);
  res.status(200).json({
    msg: "Order created successfully. Perform payment.",
    paymentUrl: rental.paymentUrl,
  });
});

// Get all rentals
exports.getAllRentals = catchAsync(async (req, res) => {
  const rentals = await RentalService.getAllRentals();
  res.status(200).json(rentals);
});

// Get a rental by ID
exports.getRentalById = catchAsync(async (req, res) => {
  const { id } = req.body; // Get rental ID from the request body
  const rental = await RentalService.getRentalById(id);

  if (!rental) {
    return res.status(404).json({ message: 'Rental not found.' });
  }
  res.status(200).json(rental);
});

// Get rentals by owner
exports.getRentalsByOwner = catchAsync(async (req, res) => {
  const ownerId = req.user._id; // Get owner ID from the authenticated user
  const rentals = await RentalService.getRentalsByOwner(ownerId);

  if (!rentals.length) {
    return res.status(404).json({ message: 'No rentals found for this owner.' });
  }

  const serverBaseUrl = `${req.protocol}://${req.get('host')}`;

  const rentalDetails = rentals.map(rental => ({
    car: {
      make: rental.car.make,
      model: rental.car.model,
      photo: `${serverBaseUrl}/uploads/${rental.car.photos[0]}`, // Full URL for the car photo
    },
    renter: {
      name: `${rental.user.first_name} ${rental.user.last_name}`,
      phone: rental.user.phone_number,
    },
    rental: {
      _id: rental._id,
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalPrice: rental.totalPrice,
      viewed: rental.viewed,
    },
  }));

  res.status(200).json(rentalDetails);
});


exports.getRentalsByRenter = catchAsync(async (req, res) => {
  const renterId = req.user._id; // Get the renter ID from the authenticated user
  const rentals = await RentalService.getRentalsByRenter(renterId);

  if (!rentals.length) {
    return res.status(404).json({ message: 'No rentals found for this renter.' });
  }

  const serverBaseUrl = `${req.protocol}://${req.get('host')}`;

  const rentalDetails = rentals.map(rental => ({
    car: {
      make: rental.car.make,
      model: rental.car.model,
      photo: `${serverBaseUrl}/uploads/${rental.car.photos[0]}`,
    },
    owner: {
      name: `${rental.owner.first_name} ${rental.owner.last_name}`,
      phone: rental.owner.phone_number,
    },
    rental: {
      _id: rental._id,
      startDate: rental.startDate,
      endDate: rental.endDate,
      rentalDays: (new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 3600 * 24),
      totalPrice: rental.totalPrice,
    },
  }));

  res.status(200).json(rentalDetails);
});


exports.getFutureRentalsForCar = catchAsync(async (req, res) => {
  const { carId } = req.query;
  const futureRentals = await RentalService.getFutureRentalsForCar(carId);

  res.status(200).json({
    message: futureRentals.length ? "Future rentals found." : "No future rentals for this car.",
    rentals: futureRentals,
  });
});


exports.updateViewedStatus = catchAsync(async (req, res) => {
  const { rentalId } = req.body; 
  const userId = req.user._id; 

  if (!rentalId) {
    return res.status(400).json({ error: "Rental ID is required" });
  }

  const rental = await RentalService.updateViewedStatus(rentalId, userId);

  res.status(200).json({
    message: 'Rental viewed status updated successfully.',
    rental,
  });
});


exports.verifyPayment = catchAsync(async (req, res) => {
  const { tx_ref } = req.params;

  const result = await RentalService.verifyPayment(tx_ref);

  return res.status(200).json({ message: 'Payment verified and rental created', rental: result });
});