const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

router.get('/', async (req, res) => {
  try {
    // Fetch the listings from MongoDB
    const listings = await Listing.find();

    // Check if the user is authenticated by looking for the username in the session
    const isAuthenticated = req.session.username ? true : false;

    // If authenticated, render the home template with the username and listings
    // If not authenticated, render the home template without the username but with listings
    res.render('profile', { isAuthenticated, username: req.session.username, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
