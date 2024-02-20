const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user && user.password === req.body.password) {
      // Store the username in the session upon successful login
      req.session.username = user.username;

      // Redirect to the home page after successful login
      res.redirect('/');
    } else {
      res.status(400).send('Invalid Login Details');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
