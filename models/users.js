const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');



module.exports = (sequelize) => {
    class User extends Model {
        // Instance method to validate password
        validPassword(password) {
            return bcryptjs.compareSync(password, this.password);
        }
    }
    User.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true // Validates that the string is an email
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // Automatically set to the current time if not provided
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'users',
        tableName: 'users',  // Explicitly specifying the table name
        timestamps: true,
        paranoid: true,
        hooks: {
            beforeCreate: async (user) => {
                user.email = user.email.toLowerCase();
                const salt = await bcryptjs.genSalt(8);
                user.password = await bcryptjs.hash(user.password, salt);
            },
            beforeUpdate: async (user) => {
                if (user.changed('email')) {
                    user.email = user.email.toLowerCase();
                }
                if (user.changed('password')) {
                    const salt = await bcryptjs.genSalt(8);
                    user.password = await bcryptjs.hash(user.password, salt);
                }
            }
        }
    });

    return User;
};
