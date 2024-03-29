// Import necessary modules and models
const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Route to handle listing deletion
router.post('/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        // Find the listing by ID and delete it
        await Listing.findByIdAndDelete(listingId);
        // Redirect to a page or send a response indicating success
        res.redirect('/'); // Redirect to listings page after deletion
    } catch (error) {
        console.error("error");
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
