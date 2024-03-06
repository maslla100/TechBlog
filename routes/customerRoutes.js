const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');




// Route for dashboard Display!
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log("Accessing the dashboard page via customer Routes");
    res.render('customer/dashboard');
});


//Route to view events on viewTechBlogPost 
router.get('/viewTechBlogPost', ensureAuthenticated, customerController.viewTechBlogs);

// Route to render the form for creating a new blog post
router.get('/viewTechBlogPost', ensureAuthenticated, (req, res) => {
    res.render('customer/viewTechBlogPost');
});


//Route to create events on dashboard
router.post('/submitcomment/:postId', ensureAuthenticated, customerController.submitComment);

//Route to create events on dashboard
router.post('/createBlogPost', ensureAuthenticated, customerController.createBlogPost);

// Route to render the form for creating a new blog post
router.get('/createBlogPost', ensureAuthenticated, (req, res) => {
    res.render('customer/createBlogPost');
});

//Route to edit events on dashboard
router.patch('/editBlogPost/:id', ensureAuthenticated, customerController.editBlogPost);

// Route to render the form for creating a new blog post
router.get('/editBlogPost', ensureAuthenticated, (req, res) => {
    res.render('customer/editBlogPost');
});


//Route to delete events on dashboard
router.delete('/deleteBlogPost/:id', ensureAuthenticated, customerController.deleteBlogPost);






module.exports = router;


