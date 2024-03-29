// deleteFromCartRoute.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Define the route handler for deleting an item from the cart
router.post('/:itemId', async (req, res) => {
  try {
    const loggedUser = res.locals.logged_user;
    if (!loggedUser) {
      // If user is not logged in, redirect to login page or handle accordingly
      return res.redirect('/login');
    }

    const itemId = req.params.itemId;

    // Find the user and remove the item from the cart
    await User.findByIdAndUpdate(loggedUser._id, { $pull: { cart: itemId } });

    // Redirect back to the view cart page
    res.redirect('/view-cart');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
