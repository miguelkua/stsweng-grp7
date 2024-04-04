// tests/routes/loginRoute.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../src/models/user.js');
const loginRoute = require('../src/routes/loginRoute.js');
const hbs = require('hbs');

// Create an Express app for testing
const app = express();

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));
app.set('view engine', 'hbs');

// Mount the login route
app.use('/login', loginRoute);

// Mock User.findOne method
jest.mock('../src/models/user.js', () => ({
  findOne: jest.fn(),
  findOne2: jest.fn(() => {throw new Error ('Internal Server Error')})
}));

// Mock bcrypt.compare method
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Mock res.render method
const res = {
  render: jest.fn()
};


describe('GET /login', () => {
  test('responds with login page', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Login');
    //console.log("response.text", response.text)
  });
});

describe('POST /login', () => {
  test('responds with redirect to home page on successful login', async () => {
    const mockUser = { username: 'testuser', password: 'hashedpassword', _id: 'userObjectId' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/');
  });

  test('responds with error message on invalid login', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' });

    expect(response.statusCode).toBe(400);
  });

  test('responds with 500 error on server error', async () => {
    //User.findOne.mockRejectedValue(new Error('Internal Server Error'));
    User.findOne.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });

    //console.log(response);

    expect(response.statusCode).toBe(500);
  });
});
