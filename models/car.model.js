const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: false },
  pricePerDay: { type: String, required: true },
  availability: {
    type: String,
    enum: ['pending', 'available', 'rented'],
    default: 'available',
  },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field for owner
    photos: {
    type: [String],
    required: true,
  },
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;