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

    // Initialize location and dateJoined variables
    let location, dateJoined;

    if (isAuthenticated) {
      // If authenticated, find the user in the database based on the username
      const user = await User.findOne({ username: req.session.username });

      // Extract location and dateJoined from the user document
      location = user.location;
      dateJoined = user.dateJoined;

      // Fetch the number of products associated with the user
      productCount = await Listing.countDocuments({ user: req.session.username });
    }

    // Log the retrieved information to the console
    console.log('Location:', location);
    console.log('Date Joined:', dateJoined);
    console.log('Product Count:', productCount);

    // Render the profile template with the retrieved information
    res.render('profile', { isAuthenticated, username: req.session.username, location, dateJoined, productCount, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
