export const studentResolvers = {
  Query: {
    allStudents: (root, args, { models: { Student } }, info) => {
      return Student.findAll();
    },
  },
  Mutation: {
    addPoints: async (root, { studentId, numPoints }, { models: { Student, Transaction } }, info) => {
      if (numPoints <= 0) throw new Error("Must input a positive number");
      await Transaction.newTransaction({ studentId, numPoints, Student });
      return true;
    },
    createStudent: async (root, { firstName, lastName, studentNumber, grade }, { models: { Student } }, info) => {
      const newStudent = await Student.create({ firstName, lastName, studentNumber, grade });
      if (!newStudent) throw new Error("Could not create user");
      return newStudent;
    },
    usePoints: async (root, { studentId, numPoints }, { models: { Student, Transaction } }, info) => {
      if (numPoints <= 0) throw new Error("Must input a positive number");
      await Transaction.newTransaction({ studentId, numPoints: -numPoints, Student });
      return true;
    },
  },
};
