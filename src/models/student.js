import { Sequelize } from "sequelize";

const student = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "student",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        validate: {
          notNull: {
            msg: "id is required for student",
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name is required",
          },
          notEmpty: (value) => {
            if (!value) throw new Error("First name is required");
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is required",
          },
          notEmpty: (value) => {
            if (!value) throw new Error("Last name is required");
          },
        },
      },
      studentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Student Number already exists",
        },
        validate: {
          notNull: {
            msg: "Student Number is required",
          },
          notEmpty: (value) => {
            if (!value) throw new Error("Student Number is required");
          },
        },
      },
      grade: {
        type: DataTypes.ENUM({
          values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        }),
      },
      numPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          isPositive: (value) => {
            if (value < 0) throw new Error("Points cannot be less than 0");
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.firstName = user.firstName.trim();
          user.lastName = user.lastName.trim();
        },
        beforeUpdate: (user, options) => {
          user.firstName = user.firstName.trim();
          user.lastName = user.lastName.trim();
        },
      },
    }
  );

  Student.associate = (models) => {
    Student.hasMany(models.Transaction, { onDelete: "CASCADE" });
  };

  return Student;
};

export default student;
