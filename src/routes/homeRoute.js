const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Check if the user is authenticated by looking for the username in the session
  const isAuthenticated = req.session.username ? true : false;
  console.log('isAuthenticated:', isAuthenticated); // Add this line for debugging

  // If authenticated, render the home template with the username
  // If not authenticated, render the home template without the username
  res.render('home', { isAuthenticated, username: req.session.username });
});

module.exports = router;