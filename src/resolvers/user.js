export const userResolvers = {
  Query: {
    allUsers: (root, args, context, info) => {
      const { User } = context.models

      return User.findAll()
    },
  },
  Mutation: {
    createUser: async (root, { email, password }, { models: { User } }, info) => {
      const newUser = await User.create({ email, password })
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
