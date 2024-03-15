const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// GET route for displaying the search page
router.get('/', (req, res) => {
  res.render('search');
});

// POST route for handling search queries
router.get('/results', async (req, res) => {
  try {
    const { query } = req.query;

    // Perform the search query on your listings collection
    const searchResults = await Listing.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
        { type: { $regex: query, $options: 'i' } }, // Case-insensitive search by type
      ]
    });

    console.log('Search Results:', searchResults); // Log the search results

    res.render('search', { searchResults });
  } catch (error) {
    console.error('Search Error:', error); // Log any errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
