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
const searchRoute = require('./routes/searchRoute'); // Import the new search route
const listingRoute = require('./routes/listingRoute'); 
const editListingRoute = require('./routes/editListingRoute');
const deleteListingRoute = require('./routes/deleteListingRoute');
const addToCartRoute = require('./routes/addToCartRoute'); // Adjust the path as needed
const viewCartRoute = require('./routes/viewCartRoute');
const deleteFromCartRoute = require('./routes/deleteFromCartRoute');

const User = require('./models/user'); // Import the User model
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

// Define formatDate helper
hbs.registerHelper('formatDate', (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
});

hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch (operator) {
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});


hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(express.urlencoded({ extended: false }));

// Define custom middleware to set logged_user for every request
app.use(async (req, res, next) => {
  try {
    if (req.session.username) {
      const logged_user = await User.findOne({ username: req.session.username });
      res.locals.logged_user = logged_user;
    } else {
      res.locals.logged_user = null;
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Use the route files
app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);
app.use('/profile',profileRoute);
app.use('/post-listing', postListingRoute); // Use the new route
app.use('/search', searchRoute); // Use the new search route
app.use('/listing', listingRoute);
app.use('/edit-listing', editListingRoute);
app.use('/delete-listing', deleteListingRoute);
app.use('/add-to-cart', addToCartRoute); // Use the new addToCart route
app.use('/view-cart', viewCartRoute);
app.use('/delete-from-cart', deleteFromCartRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});