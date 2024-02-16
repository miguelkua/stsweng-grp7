const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  try {
    const check = await User.findOne({ username: req.body.username });

    if (check && check.password === req.body.password) {
      res.render('home');
    } else {
      res.status(400).send('Invalid Login Details');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;