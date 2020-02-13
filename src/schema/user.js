export const userSchema = `
  extend type Query {
    allUsers: [User]!
  }

  extend type Mutation {
    createUser(email: String!, password: String!): User!
    login(email: String!, password: String!): String!
  }

  type User {
    id: ID!
    email: String!
  }
`
