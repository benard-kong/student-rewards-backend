import { USER_ROLES } from '../models/user'

export const userResolvers = {
  Query: {
    allUsers: (root, args, { models: { User } }, info) => {
      return User.findAll()
    },
    findUser: async (root, { email }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } })
      if (!user) return null
      return user
    },
  },
  Mutation: {
    changePassword: async (root, { email, newPassword }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } })
      try {
        await user.changePassword(newPassword)
        user.save()
        return true
      } catch (err) {
        throw new Error(err)
      }
    },
    createAdminUser: async (root, { email, password }, { models: { User } }, info) => {
      const newUser = await User.create({ email, password, role: USER_ROLES.ADMIN })
      return newUser
    },
    createUser: async (root, { email, password }, { models: { User } }, info) => {
      const newUser = await User.create({ email, password })
      if (!newUser) throw new Error('Could not create user')
      return newUser
    },
    login: async (root, { email, password }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } })
      const errorMessage = 'Login failed' // Can have different messages if your application requires
      if (!user) throw new Error(errorMessage)
      else if (!(await user.validatePassword(password))) throw new Error(errorMessage)

      return user.createToken()
    },
  },
}
