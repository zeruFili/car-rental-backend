const Rental = require("../models/rental.model.js"); // Require the Rental model
const Car = require("../models/car.model.js"); // Require the Car model
const User = require("../models/user.model.js"); // Require the User model
const request = require("request"); // Import for making HTTP requests

exports.createRental = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body; // Take rental details from the request body
    const userId = req.user._id; // Get user ID from the request
    // Validate carId
    if (!carId) {
      return res.status(400).json({ error: "Car ID is required" });
    }

    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Fetch user details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate total price based on pricePerDay and rental duration
    const pricePerDay = parseFloat(car.pricePerDay);
    const rentalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);
    const totalPrice = pricePerDay * rentalDays;

    // Generate transaction reference
    const tx_ref = `tx_${Date.now()}`; // Simple transaction reference

    // Initialize the transaction with Chapa
    const options = {
      method: 'POST',
      url: 'https://api.chapa.co/v1/transaction/initialize',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: (totalPrice).toString(), 
        currency: 'ETB',
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        tx_ref: tx_ref,
        callback_url: `http://localhost:3002/api/payment/verify/${tx_ref}`, // Adjust as needed
        meta: {
          carId: carId,
          startDate: startDate,
          endDate: endDate,
          hide_receipt: true,
        },
      }),
    };

    // Make the request to Chapa
    request(options, async function (error, response) {
      if (error) {
        console.error('Payment processing error:', error);
        return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
      }

      const body = JSON.parse(response.body);
      if (response.statusCode === 200 && body.status === 'success') {
        // Create rental document after successful payment initialization
        const rental = new Rental({
          car: carId,
          user: userId,
          owner: car.owner, // Assuming car.owner is available
          startDate,
          endDate,
          totalPrice,
          payment: {
            amount: totalPrice,
            currency: 'ETB',
            transactionId: tx_ref,
          },
        });

        await rental.save();
        res.status(200).json({
          msg: "Order created successfully. Perform payment.",
          paymentUrl: body.data.checkout_url,
        });
      } else {
        res.status(500).json({
          msg: body.message || "Something went wrong",
        });
      }
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ message: "Error processing checkout", error: error.message });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate({
        path: 'car user owner',
        select: 'first_name last_name phone_number', // Select only the desired fields
      });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRentalById = async (req, res) => {
  try {
    const { id } = req.body; // Get rental ID from the request body
    const rental = await Rental.findById(id).populate({
      path: 'car user owner',
      select: 'first_name last_name phone_number', // Select only the desired fields
    });
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found.' });
    }
    res.status(200).json(rental);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.getRentalsByOwner = async (req, res) => {
  try {
    const ownerId = req.user._id; // Get owner ID from the authenticated user
    const rentals = await Rental.find({ owner: ownerId })
      .populate({
        path: 'car user',
        select: 'first_name last_name phone_number', // Select desired fields
      });

    if (!rentals.length) {
      return res.status(404).json({ message: 'No rentals found for this owner.' });
    }

    res.status(200).json(rentals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// exports.getRentalsByRenter = async (req, res) => {
//   try {
//     const renterId = req.user._id; 
//     const rentals = await Rental.find({ user: renterId })
//       .populate({
//         path: 'car owner user',
//         select: 'first_name last_name phone_number', // Select desired fields
//       });

//     if (!rentals.length) {
//       return res.status(404).json({ message: 'No rentals found for this renter.' });
//     }

//     res.status(200).json(rentals);
//   } catch (error) {
//     console.error("Error fetching rentals:", error);
//     res.status(400).json({ message: error.message });
//   }
// };



exports.getRentalsByRenter = async (req, res) => {
  try {
    const renterId = req.user._id; // Get the renter ID from the authenticated user
    const rentals = await Rental.find({ user: renterId })
      .populate('car')
      .populate('owner');

    if (!rentals.length) {
      return res.status(404).json({ message: 'No rentals found for this renter.' });
    }

    const rentalDetails = rentals.map(rental => {
      const car = rental.car;
      const owner = rental.owner;

      // Extract details
      const carMake = car.make;
      const carModel = car.model;
      const carPhoto = car.photos[0]; // Get the first photo
      const ownerName = `${owner.first_name} ${owner.last_name}`;
      const startDate = rental.startDate;
      const endDate = rental.endDate;

      // Calculate the number of rental days
      const rentalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);
      const totalPrice = rental.totalPrice; // Assuming totalPrice is already calculated in the rental

      return {
        car: {
          make: carMake,
          model: carModel,
          photo: carPhoto,
        },
        owner: {
          name: ownerName,
          phone: owner.phone_number,
        },
        rental: {
          startDate,
          endDate,
          rentalDays,
          totalPrice,
        }
      };
    });

    // Respond with the gathered information
    res.status(200).json(rentalDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFutureRentalsForCar = async (req, res) => {
  try {
    const { carId } = req.query; // Get the car ID from request body
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    // Find rentals for the specified car that start on or after today
    const futureRentals = await Rental.find({
      car: carId,
      startDate: { $gte: today } // Filter rentals starting today or in the future
    }).select('startDate endDate'); // Select only the startDate and endDate fields

    // Return rentals or a message indicating no future rentals
    console.log("Future rentals:",futureRentals);
    res.status(200).json({
      message: futureRentals.length ? "Future rentals found." : "No future rentals for this car.",
      rentals: futureRentals
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};