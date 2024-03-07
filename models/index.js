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

// Model imports
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Post = require('./post')(sequelize, Sequelize.DataTypes);
db.Comment = require('./comment')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Post, {
    foreignKey: 'userId',
    as: 'posts',
    onDelete: 'CASCADE',
});

db.Post.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'User'
});

db.User.hasMany(db.Comment, {
    foreignKey: 'userId',
    as: 'Comment'
});

db.Comment.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'User'
});

db.Post.hasMany(db.Comment, {
    foreignKey: 'postId',
    as: 'Comment'
});

db.Comment.belongsTo(db.Post, {
    foreignKey: 'postId',
    as: 'Post'
});

db.Post.addHook('beforeSave', (post, options) => {
    if (post.content) {
        post.summary = post.content.substring(0, 100) + '...';
    }
});

module.exports = db;
