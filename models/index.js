
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
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Business = require('./business')(sequelize, Sequelize.DataTypes);
db.Service = require('./service')(sequelize, Sequelize.DataTypes);

// Defining associations

module.exports = db;
