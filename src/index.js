// Server imports
import { GraphQLServer } from 'graphql-yoga'

// Sequelize imports
import { models, sequelize } from './models'

// Schema Imports
import typeDefs from './schema'
import resolvers from './resolvers'
import { makeExecutableSchema } from 'graphql-tools'

const schema = makeExecutableSchema({ typeDefs, resolvers })
const context = () => ({ models })

const server = new GraphQLServer({ schema, context })

const options = {
  port: 8000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/__graphql-playground',
}

/*
  NOTE: Remove { force: true } in production. force: true will clean out your database each time you start your server
*/
sequelize.sync({ force: true }).then(async () => {
  await models.User.create({ firstName: 'Jane', lastName: 'Doe' })
  await models.User.create({ firstName: 'John', lastName: 'Doe' })
  server.start(options, ({ playground, port }) => {
    console.log(
      `Server is running on localhost:${port}; Navigate to localhost:${port}/${playground} for the GraphQL playground`
    )
  })
})
