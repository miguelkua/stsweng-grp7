const express = require('express');
const router = express.Router();
const multer = require('multer');
const Listing = require('../models/listing');

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
    });

    // Save the listing to MongoDB
    await newListing.save();

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
