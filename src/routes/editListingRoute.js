const express = require('express');
const multer = require('multer');
const router = express.Router();
const Listing = require('../models/listing');

// Set up multer middleware
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit per file
  },
});
// GET route for rendering the edit listing page
router.get('/:listingId', async (req, res) => {
    try {
        // Extract the listing ID from the request parameters
        const listingId = req.params.listingId;

        // Retrieve the listing details from the database based on the listing ID
        const listing = await Listing.findById(listingId);

        if (!listing) {
            // If the listing is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Listing not found' });
        }


        // Render the edit listing page with the listing data
        res.render('edit-listing', { listing });
    } catch (error) {
        // If an error occurs, handle it appropriately (e.g., send a 500 Internal Server Error response)
        console.error(error + "hello");
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route for updating a listing
router.post('/:listingId', async (req, res) => {
    try {
        // Extract the listing ID from the request parameters
        const listingId = req.params.listingId;

        // Retrieve the updated listing data from the request body
        const updatedListingData = req.body;

        // Update the listing in the database
        const updatedListing = await Listing.findByIdAndUpdate(listingId, updatedListingData, { new: true });

        if (!updatedListing) {
            // If the listing is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Redirect to the updated listing page or any other appropriate action
        res.redirect(`/listing/${listingId}`);
    } catch (error) {
        // If an error occurs, handle it appropriately (e.g., send a 500 Internal Server Error response)
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle photo removal
router.post('/:listingId/remove-photos', async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const photoIdsToRemove = req.body.photoIdsToRemove; // Assuming the frontend sends an array of photo IDs to delete

        // Find the listing by ID
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Remove the photos from the listing's photos array
        listing.photos = listing.photos.filter(photo => !photoIdsToRemove.includes(photo._id.toString()));

        // Save the updated listing
        await listing.save();

        res.redirect('/edit-listing/' + listingId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for adding photos to a listing
router.post('/:listingId/add-photos', upload.array('photosToAdd'), async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const photosToAdd = req.files;

        // Check if any files were uploaded
        if (!photosToAdd || photosToAdd.length === 0) {
            return res.status(400).json({ error: 'No photos uploaded' });
        }

        // Process the uploaded photos
        const listing = await Listing.findById(listingId);
        photosToAdd.forEach(photo => {
            listing.photos.push({
                data: photo.buffer.toString('base64'),
                contentType: photo.mimetype
            });
        });
        await listing.save();

        // Redirect or send a response indicating success
        res.redirect('/edit-listing/' + listingId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
