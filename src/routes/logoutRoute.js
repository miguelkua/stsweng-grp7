const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Clear user-related session data
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect to the home page after signing out
      res.redirect(200, '/');
    }
  });
});

module.exports = router;
