const request = require('supertest');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const profileRoute = require('../src/routes/profileRoute.js');

jest.mock('../src/models/user.js', () => ({
    findOne: jest.fn(),
    save: jest.fn()
}));
const User = require('../src/models/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));
app.use('/profile', profileRoute);

describe("Cases for profile", () => {

    const loggedInUser = {
        username: 'testuser',
        location: 'Test Location',
        phone: '1234567890',
        profilePicture: 'sampleProfilePicture.jpg'
    };

    beforeEach(() => {
        User.findOne.mockClear();
        User.save.mockClear();
    });

    test("Edit profile information with valid login", async () => {
        User.findOne.mockResolvedValue(loggedInUser);

        const updatedProfile = {
            location: 'New Location',
            phone: '0987654321',
            profilePicture: 'sampleProfilePicture.jpg'
        };

        const response = await request(app)
            .post('/profile/edit-profile')
            .send(updatedProfile);

        expect(response.statusCode).toBe(302);
        expect(User.save).toHaveBeenCalledWith(updatedProfile);
    });

    test("Attempt to update profile without being logged in", async () => {
        User.findOne.mockResolvedValue(null);

        const updatedProfile = {
            location: 'New Location',
            phone: '0987654321',
            profilePicture: 'newProfilePicture.jpg'
        };

        const response = await request(app)
            .post('/profile/edit-profile')
            .send(updatedProfile);

        expect(response.statusCode).toBe(302); // redirected to /login
        expect(User.save).not.toHaveBeenCalled();
    });
});