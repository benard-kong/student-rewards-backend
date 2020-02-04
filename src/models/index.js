import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('database-name-is-sequelize-test', 'postgres-username', 'database-password', {
  host: 'localhost',
  port: 5432, // 5432 is default
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
