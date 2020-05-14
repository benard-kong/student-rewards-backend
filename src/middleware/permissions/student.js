import * as rules from "./rules";

export const StudentQuery = {
  allStudents: rules.isAuthenticated,
};

export const StudentMutation = {
  createStudent: rules.isAdmin,
};
