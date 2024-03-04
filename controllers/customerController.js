const db = require('../models');
const { validationResult } = require('express-validator');
const { ensureAuthenticated, ensureCustomer } = require('../middleware/authMiddleware');
const bcryptjs = require('bcryptjs');
const saltRounds = 8;


const customerController = {

    // Display Customer Dashboard
    showDashboard: [ensureAuthenticated, ensureCustomer, async (req, res) => {
        try {
            const customerId = req.user.id;
            let bookings = await db.Booking.findAll({
                where: { userId: customerId },
                include: [{
                    model: db.Service,
                    include: [db.Business]
                }]
            });


            // Convert Sequelize objects to plain JavaScript objects, handle bars issue!
            bookings = bookings.map(booking => booking.get({ plain: true }));

            const customer = await db.User.findByPk(customerId);
            console.log("Dashboard Data: ", { customer, bookings });
            console.log("Rendering customer dashboard");
            console.log("Bookings Data: ", bookings);

            res.render('customer/customerDashboard', {
                customer: customer,
                bookings: bookings,
                canCreateBooking: true,
                canEditBooking: true,
                canDeleteBooking: true,
                // Dynamic links
                profileLink: '/customer/profile',
                bookingsListLink: '/customer/bookings',
                listBusinessLink: '/customer/listBusiness',
                viewServiceLink: '/customer/services',
                calendarLink: '/customer/calendar',
                logoutLink: '/auth/logout',
                // User info
                loggedIn: req.isAuthenticated(),
                isCustomer: req.user && req.user.role === 'customer',
                userName: req.user ? req.user.name : null
            });
            console.log("Dashboard rendered");

        } catch (error) {
            console.error('Error in showDashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    }],











};


module.exports = customerController;
