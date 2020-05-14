import { Sequelize } from 'sequelize'

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 5432 // 5432 is default for Postgres

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
})

export const models = {
  User: sequelize.import('./user.js'),
}

/*
  Associate code below is used if you have a custom associate method in your models.
  ie. 1 User can have many Posts, then:
  in user.js:
    User.associate = (models) => {
      User.hasMany(models.Post, { onDelete: 'CASCADE' })
    }
  in post.js:
    Post.associate = (models) => {
      Post.belongsTo(models.User)
    }
*/
Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})
