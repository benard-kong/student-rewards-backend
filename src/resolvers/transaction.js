import { Op } from "sequelize";
import getStartEndDates from "./utils/getStartEndDates";

export const transactionResolvers = {
  Query: {
    allNegativeTransactions: (root, { startDate, endDate }, { models: { Transaction } }, info) => {
      const [_startDate, _endDate] = getStartEndDates(startDate, endDate);
      return Transaction.findAll({
        where: {
          numPoints: { [Op.lt]: 0 },
          createdAt: { [Op.gte]: _startDate, [Op.lt]: _endDate },
        },
      });
    },
    allPositiveTransactions: (root, { startDate, endDate }, { models: { Transaction } }, info) => {
      const [_startDate, _endDate] = getStartEndDates(startDate, endDate);
      return Transaction.findAll({
        where: {
          numPoints: { [Op.gt]: 0 },
          createdAt: { [Op.gte]: _startDate, [Op.lt]: _endDate },
        },
      });
    },
    allTransactions: (root, { startDate, endDate }, { models: { Transaction } }, info) => {
      const [_startDate, _endDate] = getStartEndDates(startDate, endDate);
      return Transaction.findAll({
        where: {
          createdAt: { [Op.gte]: _startDate, [Op.lt]: _endDate },
        },
      });
    },
  },
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
