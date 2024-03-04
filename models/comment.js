const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Ensure this path correctly points to your Sequelize config

module.exports = (sequelize) => {
    class Comment extends Model { }

    Comment.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts', // Assuming 'posts' is the table name
                key: 'id',
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Assuming 'users' is the table name
                key: 'id',
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
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        timestamps: true // Changed to true for automatic handling
    });

    return Comment; // Ensure you return the model
};
