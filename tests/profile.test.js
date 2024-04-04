const request = require('supertest');
const express = require('express');
const session = require('express-session');
const profileRoute = require('../src/routes/profileRoute.js');

// Mock User model
jest.mock('../src/models/user.js', () => ({
  findOne: jest.fn()
}));
const User = require('../src/models/user.js');

// Mock Listing model
jest.mock('../src/models/listing.js', () => ({
  save: jest.fn(),
  find: jest.fn(),
  create: jest.fn()
}));
const Listing = require('../src/models/listing.js');

const app = express();

// Set up the Express session middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));
app.set('view engine', 'hbs');

// Mount the profile router
app.use('/profile', profileRoute);

describe('Profile Router', () => {
  test('GET /profile/:username should respond with status code 500 if User.findOne throws an error', async () => {
    User.findOne.mockRejectedValue(new Error('Database Error'));
    const response = await request(app).get('/profile/testuser');

    expect(response.status).toBe(500);

  });

  test('GET /profile/:username should respond with status code 404 if user is not found', async () => {
    User.findOne.mockResolvedValue(null);
    const response = await request(app).get('/profile/nonexistentuser');

    expect(response.status).toBe(404);
  });

});