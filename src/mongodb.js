const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/registration");
    console.log("Connection successful");
  } catch (e) {
    console.log("No connection");
  }
};

module.exports = connectDB;