const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String, // Assuming location is a string, adjust as needed
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now // Automatically set to the current date when a new user is created
  },
  profilePicture: {
    type: String,
    required: false
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing' // Assuming the name of the model for listings is 'Listing', adjust if needed
  }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;