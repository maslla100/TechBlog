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
router.get('/customerDashboard', logCustomerDashboardAccess, customerController.showDashboard);

// Profile Management
router.get('/profile', ...customerController.viewProfile);  //In use
//router.post('/profile', ...customerController.updateProfile);

// Booking Management
router.get('/bookings', ...bookingController.listBookings);  //In use - My Bookings link


// Route for calendar Display!
router.get('/calendar', ensureAuthenticated, (req, res) => {
    console.log("Accessing the calendar page via customer Routes");
    res.render('booking/calendar');
});

//Route to view events on calendar
router.get('/customer/events', ensureAuthenticated, calendarController.getEvents);

//Route to create events on calendar
router.post('/customer/events', ensureAuthenticated, calendarController.createEvent);

//Route to create events on calendar
router.patch('/customer/events/:id', ensureAuthenticated, calendarController.updateEvent);

//Route to create events on calendar
router.delete('/customer/events/:id', ensureAuthenticated, calendarController.deleteEvent);

//Route to populate drop down menus on calendar for businesses
router.get('/customer/business', ensureAuthenticated, businessController.listBusinesses_norole);

//Route to populate drop down menus on calendar for services
router.get('/customer/service', ensureAuthenticated, servicesController.listServices_norole);
router.get('/customer/service/business:Id', ensureAuthenticated, servicesController.listServices_norole);








// View Business Services
router.get('/business/:id/services', (req, res) => {
    console.log("GET /business/:id/services route called");
    servicesController.listServices(req, res);
}); // In use 

//route to list services on customerDashboard
router.get('/listBusiness', ensureAuthenticated, businessController.listBusinesses);




module.exports = router;


