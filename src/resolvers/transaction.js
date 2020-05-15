export const transactionResolvers = {
  Transaction: {
    studentName: async ({ studentId }, args, { models: { Student } }, info) => {
      const student = await Student.findByPk(studentId);
      if (!student) throw new Error("No student found associated with this transaction");
      const { firstName, lastName } = student;

      return `${firstName} ${lastName}`.trim();
    },
    teacherName: async ({ teacherId }, args, { models: { User } }, info) => {
      const teacher = await User.findByPk(teacherId);
      if (!teacher) throw new Error("No teacher found associated with this transaction");
      const { firstName, lastName } = teacher;

      return `${firstName} ${lastName}`.trim();
    },
  },
};
