// tests/routes/loginRoute.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../src/models/user.js');
const signupRoute = require('../src/routes/signupRoute.js');


const app = express();

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));

// Mount the login route
app.use('/signup', signupRoute);

describe('GET /signup', () => {
    test('responds with login page', async () => {
      const response = await request(app).get('/logout');
      expect(response.status).toBe(200);
      console.log("response.text", response.text);
      console.log(response);
    });
});