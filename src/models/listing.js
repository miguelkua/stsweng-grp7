const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: [{
    data: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  }],
  location: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
