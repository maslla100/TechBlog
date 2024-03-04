
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

// Import models
const User = require('./users')(sequelize, Sequelize.DataTypes);
const Post = require('./posts')(sequelize, Sequelize.DataTypes);
const Comment = require('./comments')(sequelize, Sequelize.DataTypes);

// Associations
User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'posts'
});
Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users'
});

User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments'
});
Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users'
});

Post.hasMany(Comment, {
    foreignKey: 'postId',
    as: 'comments'
});
Comment.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'posts'
});

// Export models and sequelize connection
module.exports = {
    sequelize,
    Sequelize,
    users,
    posts,
    comments,
};

