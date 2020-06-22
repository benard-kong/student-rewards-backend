// Server imports
import { GraphQLServer } from "graphql-yoga";

// Sequelize imports
import { models, sequelize } from "./models";
import { USER_ROLES } from "./models/user";

// Schema Imports
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { makeExecutableSchema } from "graphql-tools";

// Middleware imports
import { applyMiddleware } from "graphql-middleware";
import middlewares from "./middleware";

// Utils imports
import { getUser } from "./utils/getUser";
import schedule from "node-schedule";
import { prompt } from "./utils/prompt";

// Create Schema with Middleware
const schemaWithoutMiddleware = makeExecutableSchema({ typeDefs, resolvers });
const schema = applyMiddleware(schemaWithoutMiddleware, ...middlewares);

// Create Context
const context = async ({ request, response }) => {
  const {
    headers: { authorization },
  } = request;

  if (authorization) return { models, me: await getUser(authorization, models.User) };

  return { models };
};

// Set up server and server options
const server = new GraphQLServer({ schema, context });
const options = {
  port: 8000,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/__graphql-playground",
};

/*
  NOTE: Remove { force: true } in production. force: true will clean out your database each time you start your server
*/
sequelize.sync({ force: true }).then(async () => {
  if (process.env.NODE_ENV === "production") {
    try {
      await models.User.create({
        email: process.env.SUPER_USER_EMAIL,
        firstName: "super",
        lastName: "user",
        password: "1234567890",
      });
    } catch (e) {
      console.error(e);
    }
  } else if (process.env.NODE_ENV === "development") {
    let hasError = true;
    while (hasError) {
      try {
        const email = await prompt("What is your email?");
        const lastName = await prompt("What is your last name / surname(s)?");
        const firstName = await prompt("What is your first name(s) / given name(s)?");
        const password = await prompt("You are the superuser, please type in a password.");
        await models.User.create({
          email,
          firstName,
          lastName,
          password,
        });
        hasError = false;
      } catch (e) {
        console.error(`There was an error: ${e.message}`);
      }
    }
    /**
     await models.User.create({
       email: "john@doe.com",
       firstName: "John",
       lastName: "Doe",
       password: "1234567890",
       role: USER_ROLES.SUPER,
     });
     await models.Student.create({ firstName: "A", lastName: "B", studentNumber: "01" });
     const firstStudent = await models.Student.findOne({ where: { studentNumber: "01" } });
     await models.Transaction.create(
       { numPoints: 7, studentId: firstStudent.id, teacherId: 1, createdAt: "2020-04-15T03:15:36.512Z" },
       { Student: models.Student }
     );
     await models.Transaction.create(
       { numPoints: -5, studentId: firstStudent.id, teacherId: 1, createdAt: "2020-05-01T03:15:36.512Z" },
       { Student: models.Student }
     );
     await models.Transaction.create(
       { numPoints: -1, studentId: firstStudent.id, teacherId: 1, createdAt: "2020-05-02T03:15:36.512Z" },
       { Student: models.Student }
     );
     await models.Transaction.create(
       { numPoints: 4, studentId: firstStudent.id, teacherId: 1, createdAt: "2020-03-25T03:15:36.512Z" },
       { Student: models.Student }
     );
     await models.Student.create({ firstName: "C", lastName: "D", studentNumber: "02" });
     await models.Student.create({ firstName: "E", lastName: "F", studentNumber: "03" });
     */
  }
  server.start(options, ({ playground, port }) => {
    console.log(
      `Server is running on localhost:${port}; Navigate to localhost:${port}${playground} for the GraphQL playground`
    );
  });
  // Clean out all users' invalid tokens from tokens blacklist at midnight
  schedule.scheduleJob("0 0 */1 * *", models.User.cleanTokensBlacklist);
});
