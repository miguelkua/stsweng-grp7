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
    type: String, // You can change the type based on your specific requirements
    required: true
  },
  email: {
    type: String,
    required: true
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;