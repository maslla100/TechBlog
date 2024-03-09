# TechBlog

TechBlog is a CMS-style blog platform where developers can publish their thoughts, tutorials, and share insights with the community. This application follows the MVC (Model-View-Controller) architecture, utilizing Express.js for the server, Sequelize as the ORM, and Handlebars.js for templating. It features user authentication, role-based access control, and CRUD operations for blog posts and comments.

## Features

- **User Authentication:** Secure login and registration system with hashed passwords.
- **Role-Based Access Control:** Different access levels for regular users and administrators.
- **Blog Posting:** Users can create, edit, and delete their blog posts.
- **Comment System:** Users can comment on posts to engage with the content.
- **Responsive Design:** Adaptive and mobile-friendly design for a seamless experience on any device.

## Installation

Before you begin, ensure you have Node.js and MySQL installed on your machine.

1. **Clone the repository**
git clone https://github.com/maslla100/TechBlog
cd TechBlog

2. **Install dependencies**
npm install


3. **Configure environment**
Create a `.env` file in the root directory with your MySQL user, password, and session secret:

DB_NAME='techBlog'
DB_USER='your_mysql_username'
DB_PASS='your_mysql_password'
SESSION_SECRET='your_secret_key'


4. **Database Setup**
Run the `schema.sql` script in your MySQL client to create the TechBlog database.

Optionally, seed the database:

npm run seed


5. **Start the application**
npm server.js

Access the application at `http://localhost:3001`.

## Deployment
TechBlog is ready for deployment to services like Heroku. Make sure to set up your environment variables in your production environment for database access and session management.

## Contributing
Contributions to the TechBlog project are welcome!

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Technology used:

- Passport.js for user authentication.
- Sequelize ORM for data modeling and database management.
- Express.js as the web application framework.
- Handlebars.js for server-side templating.
- Bootstrap for front-end framework.

## Author:
Luis Llamas

## Live Heroku demo for a month only:
https://myowntechblog-549706287a14.herokuapp.com/
