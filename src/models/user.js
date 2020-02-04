const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    // the string 'user' is the name of the table in the database
    firstName: {
      type: DataTypes.STRING,
      notNull: false, // defaults to true
    },
    lastName: {
      type: DataTypes.STRING,
      notNull: false, // defaults to true
    },
  })

  // Custom methods go here (often has Model.associate to teach what models are associated, name
  // DOES NOT have to be Model.associate)
  User.customMethod = () => {}

  return User
}

export default user
