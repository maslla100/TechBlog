const { Model, DataTypes } = require('sequelize');

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
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'The title must not be empty',
                },
                len: {
                    args: [10, 255],
                    msg: 'The title must be between 10 and 255 characters long',
                },
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'The content must not be empty',
                },
                len: {
                    args: [20, 5000],
                    msg: 'The content must be between 20 and 5000 characters long',
                },
            },
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id', // 
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
        modelName: 'Post',
        tableName: 'posts',
        paranoid: true,
    });
    Post.addHook('beforeValidate', (post) => {
        if (post.title) post.title = post.title.trim();
        if (post.content) post.content = post.content.trim();
    });


    return Post;
};
