require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connection successful");
  } catch (e) {
    console.log("No connection" + e);
  }
};

module.exports = connectDB;