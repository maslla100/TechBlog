const express = require('express');
const router = express.Router();


// Importing the individual route modules
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const adminRoutes = require('./adminRoutes');


// Middleware for checking authentication and user roles
const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');

// Define the route for the home page
router.get('/', (req, res) => {
    // Render the home page view
    res.render('home');
});

// Using the imported routes and applying role-based middleware where necessary
router.use('/admin', ensureAuthenticated, ensureRole('admin'), adminRoutes);
router.use('/auth', authRoutes); // Authentication routes don't require role checks






//Catch-all for 404 errors
router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;
