const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fs = require('fs');

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
    
        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }
    
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Handle the GET request to render the form
router.get('/', (req, res) => {
    res.render('postListing', { isAuthenticated: req.session.username ? true : false });
});

// Handle the POST request to save the listing
router.post('/', upload.array('photos', 5), (req, res) => {
  const { name, brand, type, price, description } = req.body;
  const photos = req.files.map(file => file.filename);

  // Save the listing to the database or perform other actions
  console.log('Listing Data:', { name, brand, type, price, description, photos });

  res.redirect('/?isAuthenticated=' + (req.session.username ? true : false));
});

module.exports = router;
