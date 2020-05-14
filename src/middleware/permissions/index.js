import { shield, and } from "graphql-shield";
import * as rules from "./rules";
import { StudentMutation, StudentQuery } from "./student";

// All these rules are optional depending on your application
const Query = {
  allUsers: rules.isAuthenticated,
  findUser: rules.isAuthenticated,
  ...StudentQuery,
};

const Mutation = {
  createAdminUser: rules.isSuperUser,
  changePassword: and(rules.isAuthenticated, rules.isOwner),
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
