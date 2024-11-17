const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: {
    car_type: { type: String },
    company: { type: String },
    dealer: { type: String },
  },
  images: [{ type: String }], // Array of image URLs
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Car', carSchema);
