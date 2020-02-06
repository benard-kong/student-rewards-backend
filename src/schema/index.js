import { userSchema } from './user'

const linkSchema = `
  type Query {
    _: Boolean!
  }

  type Mutation {
    _: Boolean!
  }

  type Subscription {
    _: Boolean!
  }
`

export default [linkSchema, userSchema]
