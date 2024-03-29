const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route to handle viewing the cart
router.get('/', async (req, res) => {
    try {
        const loggedUser = res.locals.logged_user;
        if (!loggedUser) {
            // Redirect to login page or handle unauthorized access
            return res.redirect('/login');
        }
        // Retrieve the user's cart items
        const user = await User.findById(loggedUser._id).populate('cart');
        // Render the viewcart template with the cart data
        res.render('view-cart', { cartItems: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
