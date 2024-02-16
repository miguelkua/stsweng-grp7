const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const connectMongoDB = require('./mongodb');
const homeRoute = require('./routes/homeRoute');
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');

connectMongoDB();

const templatePath = path.join(__dirname, "../src/views");

app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.urlencoded({ extended: false }));

// Use the route files
app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});