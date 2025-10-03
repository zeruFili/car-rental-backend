const request = require("request");
const Rental = require("../models/rental.model.js");
const Car = require("../models/car.model.js");
const User = require("../models/user.model.js");

exports.createRental = async (carId, startDate, endDate, userId) => {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const pricePerDay = parseFloat(car.pricePerDay);
  const rentalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);
  const totalPrice = pricePerDay * rentalDays;

  const tx_ref = `tx_${Math.random().toString(36).substring(2, 10)}`;
  console.log("this is the tx_ref ", tx_ref);

  const options = {
    method: 'POST',
    url: 'https://api.chapa.co/v1/transaction/initialize',
    headers: {
      'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: totalPrice.toString(),
      currency: 'ETB',
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      tx_ref: tx_ref,
      callback_url: `http://localhost:3000/api/rentals/verify/${tx_ref}`, // Your own server endpoint
      meta: {
        carId: carId,
        startDate: startDate,
        endDate: endDate,
        userId: userId,
        totalPrice: totalPrice,
      },
    }),
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        return reject(new Error('Payment processing error'));
      }

      const body = JSON.parse(response.body);
      if (response.statusCode === 200 && body.status === 'success') {
        resolve({
          paymentUrl: body.data.checkout_url,
          tx_ref: tx_ref,  // Include tx_ref to be used later
        });
      } else {
        reject(new Error(body.message || "Something went wrong"));
      }
    });
  });
};

exports.getAllRentals = async () => {
  return await Rental.find().populate({
    path: 'car user owner',
    select: 'first_name last_name phone_number',
  });
};

exports.getRentalById = async (rentalId) => {
  const rental = await Rental.findById(rentalId).populate({
    path: 'car user owner',
    select: 'first_name last_name phone_number',
  });
  if (!rental) {
    throw new Error('Rental not found.');
  }
  return rental;
};

exports.getRentalsByOwner = async (ownerId) => {
  return await Rental.find({ owner: ownerId }).populate('car user');
};

exports.getRentalsByRenter = async (renterId) => {
  return await Rental.find({ user: renterId }).populate('car owner');
};

exports.getFutureRentalsForCar = async (carId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await Rental.find({
    car: carId,
    startDate: { $gte: today },
  }).select('startDate endDate');
};

exports.updateViewedStatus = async (rentalId, userId) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw new Error('Rental not found.');
  }

  if (!rental.owner.equals(userId)) {
    throw new Error('You are not authorized to update this rental.');
  }

  rental.viewed = true;
  await rental.save();
  return rental;
}; 
 



exports.verifyPayment = async (tx_ref) => {
  const options = {
    method: 'GET',
    url: `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
    headers: {
      'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, async (error, response) => {
      if (error) {
        console.error("Error during Chapa API request:", error);
        return reject(new Error('Verification error'));
      }

      const body = JSON.parse(response.body);
      console.log("Response from Chapa:", body); // Log the full response
      console.log("Response Status Code:", response.statusCode);
      
      if (response.statusCode === 200 && body.status === 'success') {
        // If payment is confirmed, create the rental
        const { carId, startDate, endDate, userId, totalPrice } = body.data.meta;

        const car = await Car.findById(carId);
        if (!car) {
          return reject(new Error("Car not found"));
        }

        const rental = new Rental({
          car: carId,
          user: userId,
          owner: car.owner, // Assuming you get this from the response
          startDate,
          endDate,
          totalPrice,
          payment: {
            amount: totalPrice,
            currency: 'ETB',
            transactionId: tx_ref,
          },
        });

        console.log("Created rental:", rental); // Log the created rental

        await rental.save();
        resolve(rental);
      } else {
        console.log("Payment verification failed:", body); // Log details of the failure
        return reject(new Error(body.message || 'Payment not successful'));
      }
    });
  });
};