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

describe('GET /logout', () => {
    test('Goes back to the login apgee', async () => {
      const response = await request(app).get('/logout');
      console.log(response);
      
      expect(response.statusCode).toBe(200)
      expect(response.session).toBeFalsy();
      console.log("response.text", response.text);
      
    });

    /*
    test('In case of error, receive a statuscode of 500', (req) => {

      const response = request(app).get('/logout');

      expect(response.statusCode).toBe(500);
      expect(response.text).toContain('Internal');
    })*/
});