export const studentSchema = `
  extend type Query {
    allStudents: [Student]!
    allTransactionsByStudent(studentId: ID!): [Transaction]!
    findStudent(studentId: ID!): Student!
  }

  extend type Mutation {
    addPoints(studentId: ID!, numPoints: Int!): Boolean!
    createStudent(firstName: String!, lastName: String!, studentNumber: String!, grade: Int): Student!
    usePoints(studentId: ID!, numPoints: Int!): Boolean!
  }

  type Student {
    id: ID!
    studentNumber: String!
    firstName: String!
    lastName: String!
    numPoints: Int!
    grade: Int
    transactions: [Transaction]!
  }

  type Transaction {
    id: ID!
    studentName: String!
    numPoints: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
