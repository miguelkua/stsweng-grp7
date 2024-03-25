const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const hbs = require('hbs');
const connectMongoDB = require('./mongodb');
const homeRoute = require('./routes/homeRoute');
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const logoutRoute = require('./routes/logoutRoute');
const postListingRoute = require('./routes/postListingRoute'); // Import the new route
const profileRoute = require('./routes/profileRoute');
connectMongoDB();

const templatePath = path.join(__dirname, "../src/views");

app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Add express-session middleware
app.use(session({
  secret: '8e1c5ec92dd02a86687f07a4e22a20be4073325debc60a80dca357d2afbcf362',
  resave: false,
  saveUninitialized: true
}));

hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(express.urlencoded({ extended: false }));

// Use the route files
app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);
app.use('/profile',profileRoute);
app.use('/post-listing', postListingRoute); // Use the new route
app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});