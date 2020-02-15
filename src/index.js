// Server imports
import { GraphQLServer } from 'graphql-yoga'

// Sequelize imports
import { models, sequelize } from './models'
import { USER_ROLES } from './models/user'

// Schema Imports
import typeDefs from './schema'
import resolvers from './resolvers'
import { makeExecutableSchema } from 'graphql-tools'

// Middleware imports
import { applyMiddleware } from 'graphql-middleware'
import middlewares from './middleware'

// Utils imports
import { getUser } from './utils/getUser'

// Create Schema with Middleware
const schemaWithoutMiddleware = makeExecutableSchema({ typeDefs, resolvers })
const schema = applyMiddleware(schemaWithoutMiddleware, ...middlewares)

// Create Context
const context = async ({ request, response }) => {
  const {
    headers: { authorization },
  } = request

  if (authorization) return { models, me: await getUser(authorization, models.User) }

  return { models }
}

// Set up server and server options
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
  await models.User.create({ email: 'jane@doe.com', password: '1234567890' })
  await models.User.create({ email: 'john@doe.com', password: '1234567890', role: USER_ROLES.SUPER })
  server.start(options, ({ playground, port }) => {
    console.log(
      `Server is running on localhost:${port}; Navigate to localhost:${port}${playground} for the GraphQL playground`
    )
  })
})
