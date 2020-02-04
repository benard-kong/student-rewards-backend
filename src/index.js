import { GraphQLServer } from 'graphql-yoga'
import { models, sequelize } from './models'

/*
  As these variables get bigger, ideally you'll want to import from external folder called schema
*/
const typeDefs = `
  type User {
    id: ID!
    firstName: String!
    lastName: String
  }
  type Query {
    allUsers: [User]!
  }
  type Mutation {
    createUser(firstName: String!, lastName: String!): User!
  }
`

/*
  As these variables get bigger, ideally you'll want to import from external folder called resolvers
*/
const resolvers = {
  Query: {
    allUsers: (root, args, context, info) => {
      const { User } = context.models

      return User.findAll()
    },
  },
  Mutation: {
    createUser: async (root, args, context, info) => {
      const { User } = context.models
      const { firstName, lastName } = args

      const newUser = await User.create({ firstName, lastName })
      return newUser
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers, context: () => ({ models }) })

sequelize.sync({ force: true }).then(async () => {
  await models.User.create({ firstName: 'Jane', lastName: 'Doe' })
  await models.User.create({ firstName: 'John', lastName: 'Doe' })
  server.start(() => {
    console.log('Server is running on localhost:4000')
  })
})
