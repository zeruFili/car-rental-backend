const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0 // Ensure total price is non-negative
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500 // Limit comment length
    }
  },
  payment: {
    amount: {
      type: Number,
      required: true,
      min: 0 // Ensure payment amount is non-negative
    },
    currency: {
      type: String,
      default: 'ETB',
      enum: ['ETB', 'USD', 'EUR', 'GBP'] // Specify allowed currencies
    },
    transactionId: {
      type: String,
      unique: true // Ensure transaction IDs are unique
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now // Default time when rental is created
  },
  updatedAt: {
    type: Date,
    default: Date.now // Default time when rental is updated
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Rental', rentalSchema);