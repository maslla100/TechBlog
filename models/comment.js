const { Model, DataTypes } = require('sequelize');

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
            allowNull: false,
            validate: {
                notNull: { msg: 'Content cannot be null' },
                notEmpty: { msg: 'Content cannot be empty' },
                len: {
                    args: [10, 500],
                    msg: 'Content must be between 10 and 500 characters'
                }
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id',
            },
            onDelete: 'CASCADE'
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
        indexes: [{ fields: ['postId'], unique: false }, { fields: ['userId'], unique: false }],
        tableName: 'comments',
        timestamps: true
    }
    );

    return Comment; // Ensure you return the model
};
