export const userSchema = `
  extend type Query {
    allUsers: [User]!
    findUser(email: String!): User
  }

  extend type Mutation {
    changePassword(email: String!, newPassword: String!): Boolean!
    createAdminUser(email: String!, password: String!): User!
    createUser(email: String!, password: String!): User!
    login(email: String!, password: String!): String!
  }

  type User {
    id: ID!
    email: String!
  }
`
