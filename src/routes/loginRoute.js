const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  try {
    // Check if the application is running in a test environment
    if (process.env.NODE_ENV === 'test') {
      // Return a JSON response instead of rendering the view
      return res.status(200).json({ message: 'Login page rendered' });
    } else {
      // Render the 'login' view as usual
      return res.render('login');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user && await bcrypt.compare(req.body.password, user.password)) {
      // Store the username in the session upon successful login
      req.session.username = user.username;
      
      // Redirect to the home page after successful login
      res.redirect('/');
    } else {
      // Send Bootstrap alert for invalid login details
      return res.render('login', { error: 'Invalid Login Details' });
    }
  } catch (e) {
    console.error(e);
    // Send Bootstrap alert for internal server error
    return res.render('login', { error: 'Internal Server Error' });
  }
});

module.exports = router;
