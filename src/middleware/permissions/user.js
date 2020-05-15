import { and } from "graphql-shield";
import * as rules from "./rules";

export const UserQuery = {
  allUsers: rules.isAuthenticated,
  findUser: rules.isAuthenticated,
};

export const UserMutation = {
  createAdminUser: rules.isSuperUser,
  changePassword: and(rules.isAuthenticated, rules.isOwner),
};
