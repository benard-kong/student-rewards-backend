export const userSchema = `
  extend type Query {
    allUsers: [User]!
  }

  extend type Mutation {
    createUser(email: String!, password: String!): User!
  }

  type User {
    id: ID!
    email: String!
  }
`
