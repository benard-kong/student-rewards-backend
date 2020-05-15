export const studentResolvers = {
  Query: {
    allStudents: (root, args, { models: { Student } }, info) => {
      return Student.findAll();
    },
    findStudent: (root, { studentId }, { models: { Student } }, info) => {
      return Student.findByPk(studentId);
    },
  },
  Mutation: {
    addPoints: async (root, { studentId, numPoints }, { me, models: { Student, Transaction } }, info) => {
      if (!me) throw new Error("Could not find logged in user, please login");
      if (numPoints <= 0) throw new Error("Must input a positive number");
      await Transaction.newTransaction({ studentId, teacherId: me.id, numPoints, Student });
      return true;
    },
    createStudent: async (root, { firstName, lastName, studentNumber, grade }, { models: { Student } }, info) => {
      const newStudent = await Student.create({ firstName, lastName, studentNumber, grade });
      if (!newStudent) throw new Error("Could not create user");
      return newStudent;
    },
    usePoints: async (root, { studentId, numPoints }, { me, models: { Student, Transaction } }, info) => {
      if (!me) throw new Error("Could not find logged in user, please login");
      if (numPoints <= 0) throw new Error("Must input a positive number");
      await Transaction.newTransaction({ studentId, teacherId: me.id, numPoints: -numPoints, Student });
      return true;
    },
  },
  Student: {
    transactions: ({ id }, args, { models: { Transaction } }, info) => {
      return Transaction.findAll({ where: { studentId: id } });
    },
  },
};
