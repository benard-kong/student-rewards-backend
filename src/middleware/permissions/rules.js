import { rule, or } from 'graphql-shield'
import { USER_ROLES } from '../../models/user'

export const isSuperUser = rule({ cache: 'contextual' })(async (parent, args, { me }, info) => {
  if (me?.role === USER_ROLES.SUPER) return true
  return false
})

export const isAdmin = or(
  rule({ cache: 'contextual' })(async (parent, args, { me }, info) => {
    if (me?.role === USER_ROLES.ADMIN) return true
    return false
  }),
  isSuperUser
)

export const isAuthenticated = or(
  rule({ cache: 'contextual' })(async (parent, args, { me }, info) => {
    if (me) return true
    return false
  }),
  isAdmin,
  isSuperUser
)
