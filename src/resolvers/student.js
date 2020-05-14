export const studentResolvers = {
  Query: {
    allStudents: (root, args, { models: { Student } }, info) => {
      return Student.findAll();
    },
    allTransactionsByStudent: async (root, { studentId }, { models: { Transaction } }, info) => {
      return Transaction.findAll({ where: { studentId } });
    },
    findStudent: async (root, { studentId }, { models: { Student } }, info) => {
      return Student.findByPk(studentId);
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
  Student: {
    transactions: async ({ id }, args, { models: { Transaction } }, info) => {
      return Transaction.findAll({ where: { studentId: id } });
    },
  },
  Transaction: {
    studentName: async ({ studentId }, args, { models: { Student } }, info) => {
      const student = await Student.findByPk(studentId);
      if (!student) throw new Error("No student found associated with this transaction");
      const { firstName, lastName } = student;

      return `${firstName} ${lastName}`.trim();
    },
  },
};
