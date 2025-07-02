const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }, // Reference to the Car being rented
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User renting the car
  startDate: { type: Date, required: true }, // Rental start date
  endDate: { type: Date, required: true }, // Rental end date
  totalPrice: { type: Number, required: true }, // Total price for the rental
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending', // Default status is 'pending'
  },
  createdAt: { type: Date, default: Date.now }, // Date of creation
});

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;