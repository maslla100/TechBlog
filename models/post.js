const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Ensure this path correctly points to your Sequelize config

module.exports = (sequelize) => {
    class Post extends Model { }

    Post.init({
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // 'users' refers to table name
                key: 'id', // 'id' refers to column name in users table
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        // Model options
        sequelize, // Passing the connection instance
        modelName: 'Post', // Choosing the model name
        tableName: 'posts', // Defining the table name explicitly
        timestamps: false // Opting out of Sequelize's automatic timestamp management
    });
    return Post;
};
