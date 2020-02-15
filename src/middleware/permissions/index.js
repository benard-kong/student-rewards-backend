import { shield, and, or } from 'graphql-shield'
import * as rules from './rules'

// All these rules are optional depending on your application
export const permissions = shield(
  {
    Query: {
      allUsers: rules.isAuthenticated,
      findUser: rules.isAuthenticated,
    },
    Mutation: {
      createAdminUser: rules.isSuperUser,
      changePassword: and(rules.isAuthenticated, or(rules.isOwner, rules.isAdmin)),
    },
  },
  {
    allowExternalErrors: true,
  }
)
