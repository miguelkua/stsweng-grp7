const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const User = require('../models/user');

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit per file
  },
});

// Read the default image file
const defaultImagePath = 'public/images/DefaultProfilePicture.jpg';
let defaultProfilePicture;

fs.readFile(defaultImagePath, (err, data) => {
  if (err) {
    console.error('Error reading default image file:', err);
  } else {
    // Convert the image data to base64
    defaultProfilePicture = Buffer.from(data).toString('base64');
  }
});

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', upload.single('profilePicture'), async (req, res) => {
  try {
      let profilePicture; // Declare profilePicture variable here

      // Check if a file was uploaded
      if (!req.file) {
        // Use the default profile picture if no file was uploaded
        profilePicture = defaultProfilePicture;
      } else {
        // Convert the uploaded file to base64
        profilePicture = req.file.buffer.toString('base64');
      }

      // Other code to save the profile picture to the user data
      // For example:
      const { username, password, email, phone, location } = req.body;

      const checkduplicate = await User.findOne({username: username});

      if(checkduplicate != null) {
        //res.status(400); //bad request code
        res.status(400);
        return res.render('signup', {error: "Username already exists!"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
          username,
          password: hashedPassword,
          email,
          phone,
          location,
          profilePicture: profilePicture // Save profile picture to user data
      };

      const newUser = await User.create(userData);

      req.session.username = newUser.username;

      // Redirect to the home page after successful signup
      res.redirect('/');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;