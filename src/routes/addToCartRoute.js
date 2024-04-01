// Import necessary modules and models
const express = require('express');
const router = express.Router();

// Route to handle adding items to the cart
router.post('/:listingId', async (req, res) => {
    try {
        // Extract the listing ID from the request parameters
        const listingId = req.params.listingId;

        // Find the logged-in user
        const loggedUser = res.locals.logged_user;
        if (!loggedUser) {
            // If user is not logged in, redirect to login page or handle accordingly
            return res.redirect('/login');
        }

        // Check if the listing is already in the user's cart
        if (loggedUser.cart.includes(listingId)) {
            // If the listing is already in the cart, return an error
            return res.status(400).json({ error: 'Listing is already in the cart' });
        }

        // Add the listing ID to the user's carta
        loggedUser.cart.push(listingId);
        await loggedUser.save();

        // Redirect back to the listing page or handle accordingly
        res.redirect(`/listing/${listingId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
