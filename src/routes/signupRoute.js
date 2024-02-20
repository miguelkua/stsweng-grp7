const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      password: hashedPassword,
      email,
      phone,
    };

    await User.create(userData);

    // Redirect to the home page after successful signup
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;