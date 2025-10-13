const RentalService = require("../services/rental.service");
const catchAsync = require("../utils/catchAsync");

// Create a rental
exports.createRental = catchAsync(async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const userId = req.user._id;

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
  const { id } = req.body;
  const rental = await RentalService.getRentalById(id);

  if (!rental) {
    return res.status(404).json({ message: 'Rental not found.' });
  }
  res.status(200).json(rental);
});

// Get rentals by owner
exports.getRentalsByOwner = catchAsync(async (req, res) => {
  const ownerId = req.user._id;
  const rentals = await RentalService.getRentalsByOwner(ownerId);

  if (!rentals.length) {
    return res.status(404).json({ message: 'No rentals found for this owner.' });
  }

  const serverBaseUrl = `${req.protocol}://${req.get('host')}`;

  const rentalDetails = rentals.map(rental => ({
    car: {
      make: rental.car.make,
      model: rental.car.model,
      photo: `${serverBaseUrl}/uploads/${rental.car.photos[0]}`,
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
      ownerViewed: rental.ownerViewed,
      renterViewed: rental.renterViewed,
    },
  }));

  res.status(200).json(rentalDetails);
});

// Get rentals by renter
exports.getRentalsByRenter = catchAsync(async (req, res) => {
  const renterId = req.user._id;
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
      ownerViewed: rental.ownerViewed,
      renterViewed: rental.renterViewed,
    },
  }));

  res.status(200).json(rentalDetails);
});

// Get future rentals for car
exports.getFutureRentalsForCar = catchAsync(async (req, res) => {
  const { carId } = req.query;
  const futureRentals = await RentalService.getFutureRentalsForCar(carId);

  res.status(200).json({
    message: futureRentals.length ? "Future rentals found." : "No future rentals for this car.",
    rentals: futureRentals,
  });
});

// Update owner viewed status
exports.updateOwnerViewedStatus = catchAsync(async (req, res) => {
  const { rentalId } = req.body;
  const userId = req.user._id;

  if (!rentalId) {
    return res.status(400).json({ error: "Rental ID is required" });
  }

  const rental = await RentalService.updateOwnerViewedStatus(rentalId, userId);

  res.status(200).json({
    message: 'Owner viewed status updated successfully.',
    rental,
  });
});

// Update renter viewed status
exports.updateRenterViewedStatus = catchAsync(async (req, res) => {
  const { rentalId } = req.body;
  const userId = req.user._id;

  if (!rentalId) {
    return res.status(400).json({ error: "Rental ID is required" });
  }

  const rental = await RentalService.updateRenterViewedStatus(rentalId, userId);

  res.status(200).json({
    message: 'Renter viewed status updated successfully.',
    rental,
  });
});

// Verify payment
exports.verifyPayment = catchAsync(async (req, res) => {
  const { tx_ref } = req.params;
  console.log("Verifying payment controller have been called for tx_ref:", tx_ref);

  const result = await RentalService.verifyPayment(tx_ref);

  return res.status(200).json({ message: 'Payment verified and rental created', rental: result });
});