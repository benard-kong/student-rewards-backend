export const transactionSchema = `
  extend type Query {
    allNegativeTransactions(startDate: String, endDate: String): [Transaction]!
    allPositiveTransactions(startDate: String, endDate: String): [Transaction]!
    allTransactions(startDate: String, endDate: String): [Transaction]!
  }

  type Transaction {
    id: ID!
    studentName: String!
    teacherName: String!
    numPoints: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
