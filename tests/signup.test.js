
// tests/routes/signupRoute.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../src/models/user.js');
const signupRoute = require('../src/routes/signupRoute.js');

// Create an Express app for testing
const app = express();

// Configure Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));
app.set('view engine', 'hbs');

// Mount the signup route
app.use('/signup', signupRoute);

// Mock User.findOne and User.create methods
jest.mock('../src/models/user.js', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

// Mock bcrypt.hash method
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const res = {
  render: jest.fn(),
}

describe('POST /signup', () => {
  const testUser = { username: 'testuser', password: 'password', phone: '1234567890', email: 'test@test.com', location: 'Test Location' };

  beforeEach(() => {
    User.findOne.mockClear();
    User.create.mockClear();
    bcrypt.hash.mockClear();
  });

  test('creates a new user and returns 200', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedpassword');
    User.create.mockResolvedValue(testUser);

    const response = await request(app)
      .post('/signup')
      .send(testUser);

    //console.log(response);
    expect(response.status).toBe(302);
    expect(User.findOne).toHaveBeenCalledWith({ username: testUser.username });
    expect(bcrypt.hash).toHaveBeenCalledWith(testUser.password, 10);
    expect(User.create).toHaveBeenCalledWith({ ...testUser, password: 'hashedpassword' });
  });

  test('fails to create a user with the same username', async () => {
    User.findOne.mockResolvedValue(testUser);

    const response = await request(app)
      .post('/signup')
      .send(testUser);

    //console.log(response);

    expect(response.statusCode).toBe(400);
  });

  test('fails to create a user with invalid or null inputs', async () => {
    const invalidUser = { username: '', password: '', phone: '', email: '', location: '' };

    const response = await request(app)
      .post('/signup')
      .send(invalidUser);

    console.log(response);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid input');
  });
});