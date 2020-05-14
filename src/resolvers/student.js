export const studentResolvers = {
  Query: {
    allStudents: (root, args, { models: { Student } }, info) => {
      return Student.findAll();
    },
  },
  Mutation: {
    createStudent: async (root, { firstName, lastName, studentNumber, grade }, { models: { Student } }, info) => {
      const newStudent = await Student.create({ firstName, lastName, studentNumber, grade });
      if (!newStudent) throw new Error("Could not create user");
      return newStudent;
    },
  },
};
