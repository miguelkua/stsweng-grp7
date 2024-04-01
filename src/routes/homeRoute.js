const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    // Fetch the listings from MongoDB
    const listings = await Listing.find();

    // Check if the user is authenticated by looking for the username in the session
    const isAuthenticated = req.session.username ? true : false;

    // Fetch user details based on the username stored in each listing
    const users = await User.find({ username: { $in: listings.map(listing => listing.user) } });

    // Map user details to listings
    const populatedListings = listings.map(listing => {
      const user = users.find(user => user.username === listing.user);
      return { ...listing.toObject(), user };
    });

    console.log(populatedListings)
    // If authenticated, render the home template with the username and listings
    // If not authenticated, render the home template without the username but with listings
    res.render('home', { isAuthenticated, listings: populatedListings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
