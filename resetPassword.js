const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env]; // Adjust path as necessary
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('./models/index'); // Adjust the path to where your models are initialized

const userEmail = process.argv[2]; // Get user email from command line argument
const newPassword = process.argv[3]; // Get new password from command line argument

if (!userEmail || !newPassword) {
    console.log('Usage: node resetPassword.js <userEmail> <newPassword>');
    process.exit(1);
}

const updatePassword = async () => {
    try {
        const user = await db.User.findOne({ where: { email: userEmail } });

        if (!user) {
            console.log('User not found!');
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

        await user.update({ password: hashedPassword });

        console.log('Password updated successfully.');
    } catch (error) {
        console.error('Error updating password:', error);
    }
};

updatePassword();
