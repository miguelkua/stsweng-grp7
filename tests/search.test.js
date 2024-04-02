const request = require('supertest');
const express = require('express');
const searchRoute = require('../src/routes/searchRoute.js');


jest.mock('../src/models/listing.js', () => ({
    find: jest.fn()
}));
const Listing = require('../src/models/listing');

jest.mock('../src/models/user.js', () => ({
    find: jest.fn()
}));
const User = require('../src/models/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/search', searchRoute);

describe("Search Feature", () => {
    beforeEach(() => {
        Listing.find.mockClear();
        User.find.mockClear();
    });

    test("Search for listings", async () => {
        const query = 'Test';
        const listingResults = [{ name: 'Test Listing', type: 'Test Type', price: 100 }];

        Listing.find.mockResolvedValue(listingResults);

        const response = await request(app).get(`/search/results?query=${query}`);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Test Listing');
        expect(Listing.find).toHaveBeenCalledWith({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },
                { type: { $regex: new RegExp(query, 'i') } }
            ]
        });
    });

    test("Search for users", async () => {
        const query = 'Test';
        const userResults = [{ username: 'testUser', email: 'test@example.com', location: 'Test Location' }];

        User.find.mockResolvedValue(userResults);

        const response = await request(app).get(`/search/results?query=${query}`);

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('testUser');
        expect(User.find).toHaveBeenCalledWith({
            $or: [
                { username: { $regex: new RegExp(query, 'i') } },
                { email: { $regex: new RegExp(query, 'i') } },
                { location: { $regex: new RegExp(query, 'i') } }
            ]
        });
    });
});