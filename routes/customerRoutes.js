const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');



// Middleware for logging
const logCustomerDashboardAccess = (req, res, next) => {
    console.log("Accessing customer dashboard route");
    next(); // Pass control to the next handler, which is showDashboard in this case
};



// Route for dashboard Display!
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log("Accessing the dashboard page via customer Routes");
    res.render('customer/dashboard');
});

//Route to view events on dashboard
router.get('/customer/dashboard', ensureAuthenticated, customerController.viewTechBlogs);

//Route to create events on dashboard
router.post('/customer/createPost', ensureAuthenticated, customerController.createBlogPost);

//Route to edit events on dashboard
router.patch('/customer/editPost:id', ensureAuthenticated, customerController.editBlogPost);

//Route to delete events on dashboard
router.delete('/customer/deletePost/:id', ensureAuthenticated, customerController.deleteBlogPost);






module.exports = router;


