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
app.set('view engine', 'hbs');
app.use('/search', searchRoute);

describe('Search Route Error Handling', () => {
    test('Null query should return 400 error', async () => {
        const response = await request(app)
            .get('/search/results')
            .send({ query: null })
        expect(response.statusCode).toBe(500);
    });

    test('No listings found should return empty results', async () => {
        Listing.find.mockResolvedValueOnce([]);
        User.find.mockResolvedValueOnce([]);

        const response = await request(app)
            .get('/search/results')
            .query({ query: 'nonexistent' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({});
    });

    test('Search should handle errors when searching for listings', async () => {
        // Mock an error in finding listings
        Listing.find.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app).get('/search/results?query=test');

        expect(response.statusCode).toBe(500);
    });

    test('Search should handle errors when searching for users', async () => {
        // Mock an error in finding users
        Listing.find.mockResolvedValueOnce([]); // Mock successful listing search
        User.find.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app).get('/search/results?query=test');

        expect(response.statusCode).toBe(500);
    });
});