// tests/routes/loginRoute.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const postListingRoute = require('../src/routes/postListingRoute.js');
const multer= require('multer');
const hbs = require('hbs');


//explicitly mock the database module
// Mock User.findOne and User.create methods
jest.mock('../src/models/user.js', () => ({
    findOne: jest.fn()
}));
const User = require('../src/models/user.js');

jest.mock('../src/models/listing.js', () => ({
    save: jest.fn(),
    create: jest.fn()
}));
const Listing = require('../src/models/listing.js');

jest.mock('multer', () => {
    const multer = () => ({
      array: () => {
        return (req, res, next) => {
          req.body = { userName: 'testUser' }
          req.files = [
            {
              originalname: 'sample.name',
              mimetype: 'sample.type',
              path: 'sample.url',
              buffer: Buffer.from('whatever'), // this is required since `formData` needs access to the buffer
            },
          ]
          return next()
        }
      },
      map: () => {
        return (req, res, next) => {
          req.files = [
            {
            data: '123134432rewfrtyuhbr5678iujbvfer567u8ikjhgfr556785yhh4rwtw45wywheh',
            contentType: 'image',
            buffer: Buffer.from('whatever'), // this is required since `formData` needs access to the buffer
            }
          ]
          return next();
        }
      }
    })
    multer.memoryStorage = () => jest.fn();
    return multer
});
  

const app = express();

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));

// Mount the login route
app.use('/post-listing', postListingRoute); // Use the new route

describe("Different invalid cases for listing an item.", () => {
    

    const nullListing = {
        name: null,
        brand: null,
        type: null,
        price: null,
        description: null,
        photos: null,
        location: null, // Use user's location
        user: null,
        datePosted: new Date(), // Set the current date and time
        availability: null, // Set the availability field to 'available'
    };

    const incompleteListing = {
        name: 'Test Product',
        brand: 'Logitech',
        type: 'Mouse',
        price: 1000,
        description: "This is a test entry used for jest testing."
    };

    const res = {
      render: jest.fn()
    };

    beforeEach(() => {
        User.findOne.mockClear();
        Listing.create.mockClear();
    });

    test("Null listing, should error", async() => {
        //Mock test to test database implementation
        User.findOne.mockResolvedValue({username: 'admin123'});
        Listing.create.mockResolvedValue(false);
        
        const response = await request(app).post('/post-listing').send(nullListing);
        //console.log(response);

        expect(response.statusCode).toBe(500);
    })
    
    test("Listing errors due to incomplete data", async() => {
        //Mock test to test database implementationa
        User.findOne.mockResolvedValue({username: 'admin123'});
        Listing.create.mockImplementation(() => {
          throw new Error();
        });
        
        const response = await request(app).post('/post-listing').send(incompleteListing);
        //console.log(response.text);

        expect(response.statusCode).toBe(500);
    })
})
