import { userSchema } from "./user";
import { studentSchema } from "./student";
import { transactionSchema } from "./transaction";

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

export default [linkSchema, userSchema, studentSchema, transactionSchema];
