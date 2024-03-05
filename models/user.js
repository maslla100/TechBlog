const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        // Instance method to validate password
        validPassword(password) {
            return bcrypt.compareSync(password, this.password);
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
        modelName: 'User', // Note: modelName is typically singular and capitalized
        tableName: 'users', // Explicitly specifying the table name to match your DB schema
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                user.email = user.email.toLowerCase();
                const salt = await bcrypt.genSalt(10); // Changed salt rounds to 10, which is a common choice
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async (user) => {
                if (user.changed('email')) {
                    user.email = user.email.toLowerCase();
                }
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    return User;
};
