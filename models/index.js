const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Correcting the model imports according to the provided paths and variable names
db.User = require('./user')(sequelize, Sequelize.DataTypes); // Assuming the file is named User.js
db.Post = require('./post')(sequelize, Sequelize.DataTypes); // Assuming the file is named Post.js
db.Comment = require('./comment')(sequelize, Sequelize.DataTypes); // Assuming the file is named Comment.js

// Associations
db.User.hasMany(db.Post, {
    foreignKey: 'userId',
    as: 'Post'
});
db.Post.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'User' // Correct singular usage as it refers to a single User
});

db.User.hasMany(db.Comment, {
    foreignKey: 'userId',
    as: 'Comment'
});
db.Comment.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'User' // Correct singular usage as it refers to a single User
});

db.Post.hasMany(db.Comment, {
    foreignKey: 'postId',
    as: 'Comment'
});
db.Comment.belongsTo(db.Post, {
    foreignKey: 'postId',
    as: 'Post' // Correct singular usage as it refers to a single Post
});

// Consolidating the export statement
module.exports = db;
