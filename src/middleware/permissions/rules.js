import { rule, or } from "graphql-shield";
import { USER_ROLES } from "../../models/user";

export const isSuperUser = rule({ cache: "contextual" })(async (parent, args, { me }, info) => {
  if (me?.role === USER_ROLES.SUPER) return true;
  return false;
});

export const isAdmin = or(
  rule({ cache: "contextual" })(async (parent, args, { me }, info) => {
    if (me?.role === USER_ROLES.ADMIN) return true;
    return false;
  }),
  isSuperUser
);

export const isOwner = rule({ cache: "strict" })(async (parent, { id, email }, { me }, info) => {
  if (id.toString() === me.id.toString()) return true;
  if (email === me.email) return true;
  return false;
});

export const isAuthenticated = or(
  rule({ cache: "contextual" })(async (parent, args, { me }, info) => {
    if (me) return true;
    return false;
  }),
  isAdmin,
  isSuperUser
);
