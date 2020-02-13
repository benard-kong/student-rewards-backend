// Server imports
import { GraphQLServer } from 'graphql-yoga'

// Sequelize imports
import { models, sequelize } from './models'

// Schema Imports
import typeDefs from './schema'
import resolvers from './resolvers'
import { makeExecutableSchema } from 'graphql-tools'

// Utils imports
import { getUser } from './utils/getUser'

const schema = makeExecutableSchema({ typeDefs, resolvers })
const context = async ({ request, response }) => {
  const {
    headers: { authorization },
  } = request

  if (authorization) return { models, me: await getUser(authorization, models.User) }

  return { models }
}

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
  await models.User.create({ email: 'jane@doe.com', password: 'hahahaha00' })
  await models.User.create({ email: 'john@doe.com', password: '1234567890' })
  server.start(options, ({ playground, port }) => {
    console.log(
      `Server is running on localhost:${port}; Navigate to localhost:${port}${playground} for the GraphQL playground`
    )
  })
})
