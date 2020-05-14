import * as rules from "./rules";

export const StudentQuery = {
  allStudents: rules.isAuthenticated,
};

export const StudentMutation = {
  addPoints: rules.isAuthenticated,
  createStudent: rules.isAdmin,
  usePoints: rules.isAuthenticated,
};
