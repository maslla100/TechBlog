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
        // Model attributes
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
                isEmail: {
                    msg: 'Must be a valid email address',
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isStrongPassword(value) {
                    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                    if (!strongPasswordRegex.test(value)) {
                        throw new Error('Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.');
                    }
                },
            },

        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'customer',
            validate: {
                isIn: {
                    args: [['customer', 'admin', 'editor']],
                    msg: "Role must be one of 'customer', 'admin', or 'editor'",
                },
            },
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
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        defaultScope: {
            attributes: { exclude: ['password'] },
        },
        hooks: {
            beforeCreate: async (user) => {
                user.email = user.email.toLowerCase();
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                user.email = user.changed('email') ? user.email.toLowerCase() : user.email;
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    return User;
};


