// tests/routes/loginRoute.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const postListingRoute = require('../src/routes/postListingRoute.js');


//explicitly mock the database module
jest.mock('mongoose');
const app = express();

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));

// Mount the login route
app.use('/post-listing', postListingRoute); // Use the new route

describe("Different invalid cases for listing an item.", () => {
    test("Empty listing", async() => {
        //Mock test to test database implementation
        const response = request(app).post('/post-listing').send({
            name: null,
            brand: null,
            type: null,
            price: null,
            description: null
        })

        response.mockResolvedValue(null);
        expect(dbresponse).toBeFalsy();
    })
})
