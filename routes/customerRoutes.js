const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

// Display the dashboard with a list of blog posts
router.get('/dashboard', ensureAuthenticated, customerController.viewTechBlogs);

// Display form to create a new blog post
router.get('/createBlogPost', ensureAuthenticated, (req, res) => {
    res.render('customer/createBlogPost');
});

// Handle submission of a new blog post
router.post('/createBlogPost', ensureAuthenticated, customerController.createBlogPost);

// Display a single blog post in full screen
//router.get('/singleBlogPost/:postId', ensureAuthenticated, customerController.singleBlogPost);

// Display form to edit an existing blog post
router.get('/editBlogPost/:postId', ensureAuthenticated, customerController.editBlogPost);

// Handle updates to an existing blog post
router.post('/editBlogPost/:postId', ensureAuthenticated, customerController.updateBlogPost);

// Handle deletion of a blog post
router.post('/deleteBlogPost/:postId', ensureAuthenticated, customerController.deleteBlogPost);

/* Display form to create a blog post comment
router.get('/submitComment', ensureAuthenticated, (req, res) => {
    res.render('customer/submitComment/:postId');
});*/


// Handle submission of a new comment on a blog post
router.post('/singleBlogPost/:postId/submitComments', ensureAuthenticated, customerController.submitComment);
router.get('/customer/singleBlogPost/:postId', ensureAuthenticated, async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await db.Post.findOne({
            where: { id: postId },
            include: [
                {
                    model: db.Comment,
                    as: 'comments', // Make sure this matches your model associations
                    include: ['User'] // Assuming 'User' is the association alias in your Comment model
                },
                'User' // Assuming 'User' is the association alias in your Post model
            ]
        });

        if (post) {
            res.render('customer/singleBlogPost', {
                post: post.get({ plain: true }),
                user: req.user,
                messages: req.flash() // Include flash messages
            });
        } else {
            req.flash('error', 'Post not found.');
            res.redirect('/customer/dashboard');
        }
    } catch (error) {
        console.error('Error fetching single blog post:', error);
        req.flash('error', 'Error fetching post.');
        res.redirect('/customer/dashboard');
    }
});


module.exports = router;
