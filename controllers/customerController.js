const db = require('../models');
const { validationResult } = require('express-validator');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const bcryptjs = require('bcryptjs');
const saltRounds = 8;
const { Post } = require('../models/index');
const moment = require('moment'); // Require moment at the top of your file



const customerController = {

    viewTechBlogs: async (req, res) => {
        try {
            const posts = await db.Post.findAll({
                include: [
                    {
                        model: db.User,
                        as: 'User',
                        attributes: ['email']
                    },
                    {
                        model: db.Comment,
                        as: 'Comment',
                        include: [{
                            model: db.User,
                            as: 'User',
                            attributes: ['email']
                        }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            // Function to format the createdAt date
            const formatDate = (date) => moment(date).format('ddd MMM DD YYYY');

            // Function to create a content preview
            const truncateContent = (content, length = 100) => {
                return content.length <= length ? content : `${content.substring(0, length)}...`;
            };

            // Convert the Sequelize objects into plain JSON objects, format the dates, and add a content preview
            const blogs = posts.map(post => {
                const plainPost = post.get({ plain: true });
                plainPost.formattedCreatedAt = formatDate(plainPost.createdAt);
                plainPost.preview = truncateContent(plainPost.content, 100); // Adjust the length as needed

                // Format comment dates
                if (plainPost.Comment) {
                    plainPost.Comment = plainPost.Comment.map(comment => {
                        comment.formattedCreatedAt = formatDate(comment.createdAt);
                        return comment;
                    });
                }

                return plainPost;
            });

            // Render the dashboard view with the blogs data
            res.render('customer/dashboard', { blogs, user: req.user });
        } catch (error) {
            console.error('Error fetching tech blogs:', error);
            res.status(500).send('Internal Server Error');
        }
    },







    viewSingleBlogPost: async (req, res) => {
        const { postId } = req.params;
        try {
            const post = await db.Post.findOne({
                where: { id: postId },
                include: [
                    {
                        model: db.User,
                        as: 'User',
                        attributes: ['email'] // Assuming 'name' is not available based on your schema
                    },
                    {
                        model: db.Comment,
                        as: 'Comment',
                        include: [{
                            model: db.User,
                            as: 'User',
                            attributes: ['email']
                        }]
                    }
                ]
            });
            if (post) {
                const formattedPostDate = moment(post.createdAt).format('ddd MMM DD YYYY');
                // Ensure comments are formatted correctly
                const commentsWithFormattedDates = post.Comment.map(comment => {
                    return {
                        ...comment.get({ plain: true }),
                        formattedDate: moment(comment.createdAt).format('ddd MMM DD YYYY') // Ensure this line correctly formats the date
                    };
                });

                res.render('customer/singleBlogPost', {
                    post: post.get({ plain: true }),
                    formattedPostDate,
                    comments: commentsWithFormattedDates, // Make sure to pass this correctly
                    postId: postId,
                    user: req.user
                });
            }
            else {
                res.status(404).send('Post not found'); // Adjust according to your application's error handling
            }
        } catch (error) {
            console.error('Error fetching single blog post:', error);
            res.status(500).send('Internal Server Error');
        }
    },











    editBlogPost: async (req, res) => {
        const { postId } = req.params;

        try {
            const post = await Post.findOne({
                where: { id: postId },
                include: [{ model: db.User, as: 'User', attributes: ['email'] }]
            });

            // Check if post exists
            if (post) {
                // Render the edit post view with the current post details
                res.render('customer/editBlogPost', { post: post.get({ plain: true }), user: req.user });
            } else {
                // If post not found, redirect to dashboard with an error message
                req.flash('error', 'Post not found or you do not have permission to edit this post.');
                return res.redirect('/customer/dashboard');
            }
        } catch (error) {
            console.error('Error fetching editable post:', error);
            req.flash('error', 'Error fetching post for editing.');
            res.redirect('/customer/dashboard');
        }
    },


    updateBlogPost: async (req, res) => {
        const { postId } = req.params;
        const { title, content, categories } = req.body;

        try {
            // Update the post
            await Post.update({ title, content }, { where: { id: postId } });

            req.flash('success', 'Blog post updated successfully.');
            res.redirect(`/customer/singleBlogPost/${postId}?updated=true`);
        } catch (error) {
            console.error('Error updating blog post:', error);
            req.flash('error', 'Error updating blog post.');
            res.redirect(`/customer/editBlogPost/${postId}`);
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
            res.redirect('/customer/dashboard'); // Redirect to the dashboard or the new post's page after successful creation
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Extracting validation error messages and joining them into a single string message
                const errorMessage = error.errors.map(err => err.message).join('. ');
                req.flash('error', `Error creating blog post: ${errorMessage}`);
            } else {
                console.error('Error creating new blog post:', error);
                req.flash('error', 'Error creating blog post.');
            }
            res.redirect('/customer/createBlogPost'); // Redirect back to the form with an error message
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
            res.redirect('/customer/dashboard'); // Redirect back to the dashboard
        } catch (error) {
            console.error('Error deleting blog post:', error);
            req.flash('error', 'Error deleting blog post.');
            res.redirect('/customer/dashboard'); // Redirect back to the dashboard with an error message
        }
    },

    submitComment: async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        try {
            // Create the comment
            await db.Comment.create({
                content,
                postId,
                userId
            });

            // Fetch the post and its comments again to display
            const post = await db.Post.findOne({
                where: { id: postId },
                include: [
                    {
                        model: db.Comment,
                        as: 'Comment',
                        include: [
                            {
                                model: db.User,
                                as: 'User',
                                attributes: ['id', 'email'] // Adjust as necessary
                            }
                        ]
                    },
                    {
                        model: db.User,
                        as: 'User',
                        attributes: ['id', 'email']
                    }
                ]
            });

            if (!post) {
                req.flash('error', 'Post not found.');
                return res.redirect('/customer/dashboard');
            }

            // Redirect to the singleBlogPost page with the updated post and comments
            //res.render('customer/singleBlogPost', { post: post.get({ plain: true }), user: req.user, updated: true });
            req.flash('success', 'Comment added successfully.');
            res.redirect(`/customer/singleBlogPost/${postId}`); // Adjust this route if necessary
        } catch (error) {
            console.error('Error submitting comment:', error);
            req.flash('error', 'Error submitting comment.');
            res.redirect(`/customer/singleBlogPost/${postId}`);
        }
    },


};


module.exports = customerController;

