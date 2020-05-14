import { userSchema } from "./user";
import { studentSchema } from "./student";

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
`;

export default [linkSchema, userSchema, studentSchema];
