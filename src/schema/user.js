export const userSchema = `
  extend type Query {
    allUsers: [User]!
  }

  extend type Mutation {
    createUser(firstName: String!, lastName: String!): User!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
  }
`
