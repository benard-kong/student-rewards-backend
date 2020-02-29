export const userSchema = `
  extend type Query {
    allUsers: [User]!
    checkValidToken(token: String!): Boolean!
    findUser(email: String!): User
  }

  extend type Mutation {
    changePassword(email: String!, newPassword: String!): Boolean!
    createAdminUser(email: String!, password: String!): User!
    createUser(email: String!, password: String!): User!
    forgotPassword(email: String!): Boolean
    login(email: String!, password: String!): String!
    logout(token: String!): Boolean!
    resetPassword(email: String!, password: String!, token: String!): String!
  }

  type User {
    id: ID!
    email: String!
  }
`
