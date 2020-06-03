import { and, or } from "graphql-shield";
import * as rules from "./rules";

export const UserQuery = {
  allUsers: rules.isAdmin,
  findUser: or(rules.isAdmin, rules.isOwner),
};

export const UserMutation = {
  createAdminUser: rules.isAdmin,
  createUser: rules.isAdmin,
  changePassword: or(rules.isAdmin, and(rules.isAuthenticated, rules.isOwner)),
};
