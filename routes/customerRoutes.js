const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');



// Middleware for logging
const logCustomerDashboardAccess = (req, res, next) => {
    console.log("Accessing customer dashboard route");
    next(); // Pass control to the next handler, which is showDashboard in this case
};

// Route for the Customer's dashboard
router.get('/customerDashboard', logCustomerDashboardAccess, ensureAuthenticated, customerController.showDashboard);




module.exports = router;


