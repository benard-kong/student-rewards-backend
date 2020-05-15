import { USER_ROLES } from "../models/user";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail";

export const userResolvers = {
  Query: {
    allUsers: (root, args, { models: { User } }, info) => {
      return User.findAll();
    },
    checkValidToken: (root, { token }, { models: { User } }, info) => {
      return User.checkValidToken(token);
    },
    findUser: async (root, { email }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } });
      if (!user) return null;
      return user;
    },
  },
  Mutation: {
    changePassword: async (root, { email, newPassword }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } });
      try {
        await user.changePassword(newPassword);
        user.save();
      } catch (err) {
        throw new Error(err);
      }

      return true;
    },
    createAdminUser: async (root, { email, firstName, lastName, password }, { models: { User } }, info) => {
      const newUser = await User.create({ email, firstName, lastName, password, role: USER_ROLES.ADMIN });
      return newUser;
    },
    createUser: async (root, { email, firstName, lastName, password }, { models: { User } }, info) => {
      const newUser = await User.create({ email, firstName, lastName, password });
      if (!newUser) throw new Error("Could not create user");
      return newUser;
    },
    forgotPassword: async (root, { email }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } });
      if (user) {
        const token = user.createToken("3m");
        sendResetPasswordEmail(token, email);
      }

      return true;
    },
    login: async (root, { email, password }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } });
      const errorMessage = "Login failed"; // Can have different messages if your application requires
      if (!user) throw new Error(errorMessage);
      else if (!(await user.validatePassword(password))) throw new Error(errorMessage);

      return user.createToken();
    },
    logout: async (root, { token }, { me, models: { User } }, info) => {
      // TODO: Is there a way to take token from the header and pass it here (and only to this resolver)?
      // That way front end does not need to pass in an argument.
      const user = await User.findByPk(me.id);
      if (!user) throw new Error("Error while logging out");
      await user.logout(token);
      return true;
    },
    resetPassword: async (root, { email, password, token }, { models: { User } }, info) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("Reset password failed");
      else if (!User.checkValidToken(token)) throw new Error("Token expired, try again");

      try {
        await user.changePassword(password);
        user.save();
      } catch (err) {
        throw new Error(err);
      }

      return user.createToken();
    },
  },
  User: {
    transactions: ({ id }, args, { models: { Transaction } }, info) => {
      return Transaction.findAll({ where: { teacherId: id } });
    },
  },
};
