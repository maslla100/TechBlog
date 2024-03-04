const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust the path as necessary to point to your Sequelize config


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
                model: 'posts', // 'posts' refers to table name
                key: 'id', // 'id' refers to column name in posts table
            }
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
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'comments', // We need to choose the model name
        tableName: 'comments', // Table name as defined in the schema
        timestamps: false // Because we are explicitly defining createdAt and updatedAt
    });

};
