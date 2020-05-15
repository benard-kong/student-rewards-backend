import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const USER_ROLES = {
  SUPER: "SUPER",
  ADMIN: "ADMIN",
  USER: "USER",
};

const passwordMinLength = 8;

const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      // the string 'user' is the name of the table in the database
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            msg: "Invalid Email",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name is required",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          len: {
            args: [passwordMinLength],
            msg: `Password must be ${passwordMinLength} or more characters`,
          },
        },
      },
      role: {
        type: DataTypes.ENUM({
          values: [USER_ROLES.SUPER, USER_ROLES.ADMIN, USER_ROLES.USER],
        }),
        defaultValue: USER_ROLES.USER,
      },
      tokensBlacklist: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        validate: {
          isValidJwt(newArrayObject) {
            // **********************************************
            // Checks if token added to new array is a valid JWT token. If not, throw error and do not save it in the database.
            // **********************************************
            if (newArrayObject.length > 0) {
              const newestToken = newArrayObject[newArrayObject.length - 1];
              try {
                jwt.verify(newestToken, process.env.JWT_SECRET_KEY);
              } catch (e) {
                throw new Error("Invalid token. Not adding to blacklist.");
              }
            }
          },
        },
        defaultValue: [],
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.firstName = user.firstName.trim();
          user.lastName = user.lastName.trim();
        },
        beforeUpdate: (user, options) => {
          user.firstName = user.firstName.trim();
          user.lastName = user.lastName.trim();
        },
      },
    }
  );

  // Custom methods go here (often has Model.associate to teach what models are associated, name
  // DOES NOT have to be Model.associate)
  User.customMethod = () => {};
  User.associate = (models) => {
    User.hasMany(models.Transaction, { foreignKey: "teacherId", sourceKey: "id", onDelete: "CASCADE" });
  };

  User.beforeCreate(async (user, options) => {
    user.password = await user.generatePasswordHash(user.password);
  });

  User.checkValidToken = (token) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return false;
    }

    return true;
  };

  User.cleanTokensBlacklist = async () => {
    const allUsers = await User.findAll();
    allUsers.forEach(async (user) => {
      const newTokensBlacklist = user.tokensBlacklist.filter((token) => {
        try {
          jwt.verify(token, process.env.JWT_SECRET_KEY);
          return true;
        } catch (e) {
          return false;
        }
      });
      if (newTokensBlacklist.length < user.tokensBlacklist.length) {
        user.tokensBlacklist = newTokensBlacklist;
        await user.save();
      }
    });
  };

  User.prototype.changePassword = async function (newPassword) {
    if (newPassword.length < passwordMinLength) throw new Error(`Password must be >= ${passwordMinLength} characters`);
    this.password = await this.generatePasswordHash(newPassword);
  };

  User.prototype.createToken = function (expiresIn = "15m") {
    const _expiresIn = process.env.DEV_MODE ? "365d" : expiresIn;
    const { id, email } = this;
    return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, { expiresIn: _expiresIn });
  };

  User.prototype.generatePasswordHash = function (plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
  };

  User.prototype.logout = async function (token) {
    this.tokensBlacklist = [...this.tokensBlacklist, token];
    await this.save();
  };

  User.prototype.validatePassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  };

  return User;
};

export default user;
