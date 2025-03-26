const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/AuthRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.render('register', { title: 'Home' });
});

app.get('/auth/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = {app};
