const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };
    await User.create(data);
    res.render('home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;