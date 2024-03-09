const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const db = require('../models/index')

// Display the dashboard with a list of blog posts
router.get('/dashboard', ensureAuthenticated, customerController.viewTechBlogs);

// Display form to create a new blog post
router.get('/createBlogPost', ensureAuthenticated, (req, res) => {
    res.render('customer/createBlogPost');
});

// Handle submission of a new blog post
router.post('/createBlogPost', ensureAuthenticated, customerController.createBlogPost);

// Display form to edit an existing blog post
router.get('/editBlogPost/:postId', ensureAuthenticated, customerController.editBlogPost);

// Handle updates to an existing blog post
router.post('/editBlogPost/:postId', ensureAuthenticated, customerController.updateBlogPost);

// Handle deletion of a blog post
router.post('/deleteBlogPost/:postId', ensureAuthenticated, customerController.deleteBlogPost);



router.get('/singleBlogPost/:postId', ensureAuthenticated, customerController.submitComment);
// Display form to create a new blog post
router.get('/singleBlogPost/:postId', ensureAuthenticated, (req, res) => {
    res.render('customer/singleBlogPost/post:Id');
});
// Handle submission of a new comment on a blog post
router.post('/singleBlogPost/:postId/submitComments', ensureAuthenticated, customerController.submitComment);



module.exports = router;
