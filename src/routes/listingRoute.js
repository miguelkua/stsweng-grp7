const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/:listingId', async (req, res) => {
    try {
        // Extract the listing ID from the request parameters
        const listingId = req.params.listingId;

        // Retrieve the listing details from the database based on the listing ID
        // Validate if listingId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ error: 'Invalid listing ID' });
        }

        const listing = await Listing.findById(listingId);

        if (!listing) {
            // If the listing is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Listing not found' });
        }

        const user = await User.findOne({ username: listing.user });

        let isCurrentUser = false;
        if (res.locals.logged_user) {
            isCurrentUser = (res.locals.logged_user.username === listing.user);
        }
        // If the listing is found, render the listing details view with the listing data
        res.render('listing', { listing, user, isCurrentUser });
    } catch (error) {
        // If an error occurs, handle it appropriately (e.g., send a 500 Internal Server Error response)
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
