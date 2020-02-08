export const userResolvers = {
  Query: {
    allUsers: (root, args, context, info) => {
      const { User } = context.models

      return User.findAll()
    },
  },
  Mutation: {
    createUser: async (root, args, context, info) => {
      const { User } = context.models
      const { email, password } = args

      const newUser = await User.create({ email, password })
      return newUser
    },
  },
}
