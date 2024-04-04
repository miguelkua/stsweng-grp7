const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const User = require('../models/user');
const multer = require('multer');


// Set up Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});

// Route to handle changing the profile picture
router.post('/change-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.redirect('/profile/edit-profile?error=NoFileUploaded');
    }

    // Check if file size exceeds the limit
    if (req.file.size > 5 * 1024 * 1024) {
      return res.redirect('/profile/edit-profile?error=FileSizeExceeded');
    }
    // Get the user from the session or wherever it's stored
    const loggedInUser = res.locals.logged_user; // Example: req.user if using Passport.js
    // Update the user's profile picture in the database
    loggedInUser.profilePicture = req.file.buffer.toString('base64'),
  
    await loggedInUser.save();

    // Redirect the user to their profile page
    res.redirect('/profile/edit-profile');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET route to render the edit profile form
router.get('/edit-profile', async (req, res) => {
  try {
    const loggedUser = res.locals.logged_user;
    // If user is not logged in, redirect to login page
    if (!loggedUser) {
      return res.redirect('/login');
    }

    // Get the error message from query parameters, if any
    const errorMessage = req.query.error;

    res.render('edit-profile', { user: loggedUser, error: errorMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to handle profile editing form submission
router.post('/edit-profile', async (req, res) => {
  try {
    const loggedUser = res.locals.logged_user;

    // If user is not logged in, redirect to login page
    if (!loggedUser) {
      return res.redirect('/login');
    }

    // Update user information based on form data
    // Only update location, phone, and profilePicture if provided in the form
    if (req.body.location) {
      loggedUser.location = req.body.location;
    }
    if (req.body.phone) {
      loggedUser.phone = req.body.phone;
    }
    if (req.file) {
      loggedUser.profilePicture = req.file.filename; // Assuming you are using Multer for file upload
    }

    // Save the updated user profile
    await loggedUser.save();

    // Redirect to the profile page
    res.redirect('/profile/' + loggedUser.username);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

// Profile route
router.get('/:username', async (req, res) => {
  try {
    const profileUsername = req.params.username;
    const loggedUser = res.locals.logged_user; // Access the logged_user variable from middleware

    // Find the user in the database based on the username
    const user = await User.findOne({ username: profileUsername });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the listings associated with the user
    const listings = await Listing.find({ user: profileUsername });

    // Determine if the logged-in user is viewing their own profile
    const isCurrentUser = (loggedUser && loggedUser.username === profileUsername);

    // Render the profile template with the retrieved information
    res.render('profile', { 
      username: profileUsername,
      location: user.location, 
      dateJoined: user.dateJoined, 
      productCount: listings.length, 
      listings,
      profilePicture: user.profilePicture,
      isCurrentUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
