// tests/routes/loginRoute.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const logoutRoute = require('../src/routes/logoutRoute.js');

const app = express();

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));

// Mount the login route
app.use('/logout', logoutRoute);

// Import the necessary libraries for mocking
const httpMocks = require('node-mocks-http');

// Mock the session.destroy function to simulate an error
const mockDestroy = jest.fn((callback) => {
  const error = new Error('Simulated error');
  callback(error);
});

const mockDestroy2 = jest.fn((callback) => {
  callback();
});

// Mock req and res objects
const req = httpMocks.createRequest({
  session: {
    destroy: mockDestroy
  }
});

const req2 = httpMocks.createRequest({
  session: {
    destroy: mockDestroy2
  }
});
const res = httpMocks.createResponse();

// The router.get function you want to test
const getFunction = (req, res) => {
  // Clear user-related session data
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect to the home page after signing out
      res.redirect('/');
    }
  });
};

// Testing the getFunction with Jest
describe ('GET /logout', () => {
  test ('req.session.destroy successfuly runs and redirects', async () => {
    getFunction(req2, res);

    expect(res.statusCode).toBe(302);
  });

  test('req.session.destroy throws an error', () => {
    getFunction(req, res);
  
    // Check if destroy was called
    expect(mockDestroy).toHaveBeenCalled();
  
    // Check the response status code and message
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toBe('Internal Server Error');
  });
});
