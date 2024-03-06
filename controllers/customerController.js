const db = require('../models');
const { validationResult } = require('express-validator');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const bcryptjs = require('bcryptjs');
const saltRounds = 8;
const { Post } = require('../models/index');



const customerController = {

    viewTechBlogs: async (req, res) => {
        try {
            // Retrieve all posts from the database
            const posts = await Post.findAll({
                include: [{ model: db.User, as: 'User', attributes: ['email'] }], // Assuming you want to include the author's email
                order: [['createdAt', 'DESC']] // Orders posts by creation date, newest first
            });

            // Convert the Sequelize objects into plain JSON objects
            const blogs = posts.map(post => post.get({ plain: true }));

            // Render a view and pass the retrieved blogs to it
            res.render('customer/dashboard', { blogs });
        } catch (error) {
            console.error('Error fetching tech blogs:', error);
            res.status(500).send('Internal Server Error');
        }
    },


    createBlogPost: async (req, res) => {
        // Ensure the user is authenticated
        if (!req.isAuthenticated()) {
            req.flash('error', 'You must be logged in to create a blog post.');
            return res.redirect('/');
        }

        const { title, content, categories } = req.body; // Assuming categories is optional and an array of category IDs
        const userId = req.user.id; // Assuming the user's ID is available in the request object after authentication

        try {
            // Create the blog post
            const newPost = await Post.create({
                title,
                content,
                userId // Associating the new post with the logged-in user
            });

            // If categories are provided, associate them with the post
            if (categories && Array.isArray(categories)) {
                await newPost.setCategories(categories); // Assuming a many-to-many relationship setup in your Sequelize models
            }

            req.flash('success', 'Blog post created successfully.');
            res.redirect('customer/dashboard'); // Redirect to the dashboard or the new post's page
        } catch (error) {
            console.error('Error creating new blog post:', error);
            req.flash('error', 'Error creating blog post.');
            res.redirect('customer/dashboard'); // Redirect back to the dashboard or form with an error message
        }
    },


    editBlogPost: async (req, res) => {
        const { postId } = req.params; // Assuming the post ID is passed as a URL parameter
        const { title, content, categories } = req.body;
        const userId = req.user.id; // Assuming the user's ID is available after authentication

        try {
            // Fetch the existing post from the database
            const post = await Post.findOne({ where: { id: postId, userId } });

            if (!post) {
                req.flash('error', 'Post not found or you do not have permission to edit this post.');
                return res.redirect('customer/dashboard');
            }

            // Update the post with new values
            await post.update({ title, content });

            // If categories are provided, update them
            if (categories && Array.isArray(categories)) {
                // Assuming a many-to-many relationship setup in your Sequelize models
                // First, clear existing categories, then set new ones
                await post.setCategories([]); // Clear existing associations
                await post.setCategories(categories); // Set new associations
            }

            req.flash('success', 'Blog post updated successfully.');
            res.redirect(`customer/dashboard/${postId}`); // Redirect to the updated post's page
        } catch (error) {
            console.error('Error updating blog post:', error);
            req.flash('error', 'Error updating blog post.');
            res.redirect('customer/dashboard'); // Redirect back to the dashboard or form with an error message
        }
    },


    deleteBlogPost: async (req, res) => {
        const { postId } = req.params; // Assuming the post ID is passed as a URL parameter
        const userId = req.user.id; // Assuming the user's ID is available after authentication

        try {
            // Attempt to fetch the post to be deleted to ensure the user has permission to delete it
            const post = await Post.findOne({ where: { id: postId, userId } });

            if (!post) {
                req.flash('error', 'Post not found or you do not have permission to delete this post.');
                return res.redirect('customer/dashboard');
            }

            // Delete the post
            await post.destroy();

            req.flash('success', 'Blog post deleted successfully.');
            res.redirect('customer/dashboard'); // Redirect back to the dashboard
        } catch (error) {
            console.error('Error deleting blog post:', error);
            req.flash('error', 'Error deleting blog post.');
            res.redirect('customer/dashboard'); // Redirect back to the dashboard with an error message
        }
    }

};


module.exports = customerController;

