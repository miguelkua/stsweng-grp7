const express = require('express');
const router = express.Router();
const multer = require('multer');
const Listing = require('../models/listing');
const User = require('../models/user'); // Import the User model

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit per file
  },
});

// GET route for displaying the post listing page
router.get('/', (req, res) => {
  res.render('post-listing');
});

router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const { name, brand, type, price, description } = req.body;

    // Get username from the session
    const username = req.session.username;

    // Fetch user data to get the location
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
      
    const uploadedImages = req.files.map(file => {
      return {
        data: file.buffer.toString('base64'),
        contentType: file.mimetype,
      };
    });

    const newListing = new Listing({
      name,
      brand,
      type,
      price,
      description,
      photos: uploadedImages,
      location: user.location, // Use user's location
      user: username,
      datePosted: new Date(), // Set the current date and time
      availability: 'available', // Set the availability field to 'available'
    });

    // Save the current date and time to datePosted
    await newListing.save();

    res.render('post-listing', { success: 'Listing created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
