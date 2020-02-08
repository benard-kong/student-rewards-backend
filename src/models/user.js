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
  })

  // Custom methods go here (often has Model.associate to teach what models are associated, name
  // DOES NOT have to be Model.associate)
  User.customMethod = () => {}

  return User
}

export default user
