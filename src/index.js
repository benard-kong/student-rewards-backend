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

sequelize.sync({ force: true }).then(async () => {
  await models.User.create({ firstName: 'Jane', lastName: 'Doe' })
  await models.User.create({ firstName: 'John', lastName: 'Doe' })
  server.start(() => {
    console.log('Server is running on localhost:4000')
  })
})
