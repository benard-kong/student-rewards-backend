import { shield } from "graphql-shield";
import { StudentMutation, StudentQuery } from "./student";
import { TransactionQuery } from "./transaction";
import { UserMutation, UserQuery } from "./user";

const Query = {
  ...UserQuery,
  ...StudentQuery,
  ...TransactionQuery,
};

const Mutation = {
  ...UserMutation,
  ...StudentMutation,
};

export const permissions = shield(
  {
    Query,
    Mutation,
  },
  {
    allowExternalErrors: true,
  }
);
