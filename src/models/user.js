import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const USER_ROLES = {
  SUPER: 'SUPER',
  ADMIN: 'ADMIN',
  USER: 'USER',
}

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    // the string 'user' is the name of the table in the database
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          msg: 'Invalid Email',
        },
        notNull: {
          msg: 'Email is required',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required',
        },
        len: {
          args: [8],
          msg: 'Password must be >= 8 characters',
        },
      },
    },
    role: {
      type: DataTypes.ENUM({
        values: [USER_ROLES.SUPER, USER_ROLES.ADMIN, USER_ROLES.USER],
      }),
      defaultValue: USER_ROLES.USER,
    },
  })

  // Custom methods go here (often has Model.associate to teach what models are associated, name
  // DOES NOT have to be Model.associate)
  User.customMethod = () => {}

  User.beforeCreate(async (user, options) => {
    user.password = await user.generatePasswordHash()
  })

  User.checkValidToken = (token) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch (err) {
      return false
    }

    return true
  }

  User.prototype.createToken = function() {
    const { id, email } = this
    return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
  }

  User.prototype.generatePasswordHash = function() {
    return bcrypt.hash(this.password, 10)
  }

  User.prototype.validatePassword = function(inputPassword) {
    return bcrypt.compare(inputPassword, this.password)
  }

  return User
}

export default user
