const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const User = require('../models/user');

// GET route for displaying the search page
router.get('/', (req, res) => {
  res.render('search');
});

// POST route for handling search queries
router.get('/results', async (req, res) => {
  try {
    const { query } = req.query;

    // Perform the search query on both listings and users
    const listingResults = await Listing.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
        { type: { $regex: query, $options: 'i' } }, // Case-insensitive search by type
      ]
    });

    const userResults = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Case-insensitive search by username
        { email: { $regex: query, $options: 'i' } }, // Case-insensitive search by email
        { location: { $regex: query, $options: 'i' } }, // Case-insensitive search by location
      ]
    });

    res.render('search', { listingResults, userResults });
  } catch (error) {
    console.error('Search Error:', error); // Log any errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
