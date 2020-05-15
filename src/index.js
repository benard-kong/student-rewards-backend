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
  if (process.env.DEV_MODE) {
    await models.User.create({
      email: "jane@doe.com",
      firstName: "Jane S. ",
      lastName: " Doe ",
      password: "1234567890",
    });
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
      { numPoints: 7, studentId: firstStudent.id, teacherId: 1 },
      { Student: models.Student }
    );
    await models.Student.create({ firstName: "C", lastName: "D", studentNumber: "02" });
    await models.Student.create({ firstName: "E", lastName: "F", studentNumber: "03" });
  }
  server.start(options, ({ playground, port }) => {
    console.log(
      `Server is running on localhost:${port}; Navigate to localhost:${port}${playground} for the GraphQL playground`
    );
  });
  // Clean out all users' invalid tokens from tokens blacklist at midnight
  schedule.scheduleJob("0 0 */1 * *", models.User.cleanTokensBlacklist);
});
