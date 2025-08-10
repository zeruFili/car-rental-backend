const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  photo: { type: String, required: true }
});

const Try = mongoose.model('Try', carSchema);
module.exports = Try;