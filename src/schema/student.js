export const studentSchema = `
  extend type Query {
    allStudents: [Student]!
  }

  extend type Mutation {
    createStudent(firstName: String!, lastName: String!, studentNumber: String!, grade: Int): Student!
  }

  type Student {
    id: ID!
    studentNumber: String!
    firstName: String!
    lastName: String!
    numPoints: Int!
    grade: Int
  }
`;
