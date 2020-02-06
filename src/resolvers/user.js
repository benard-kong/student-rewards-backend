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
      const { firstName, lastName } = args

      const newUser = await User.create({ firstName, lastName })
      return newUser
    },
  },
}
