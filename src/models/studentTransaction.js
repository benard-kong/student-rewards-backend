const transaction = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("transaction", {
    numPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isNonZero: (value) => {
          if (value === 0) throw new Error("Cannot have a transaction with 0 points");
        },
      },
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Must provide a studentId",
        },
      },
      references: {
        model: "students",
        key: "id",
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: {
          msg: "Must provide a userId",
        },
      },
      references: {
        model: "users",
        key: "id",
      },
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Student);
    Transaction.belongsTo(models.User, { foreignKey: "teacherId", targetKey: "id" });
  };

  Transaction.beforeCreate(async (transaction, options) => {
    const { studentId, numPoints } = transaction;
    const { Student } = options;
    const student = await Student.findByPk(studentId);
    // if (student.numPoints + numPoints < 0) { // This may not be necessary because of student's numPoints validation
    //   throw new Error("That operation will leave the student with negative points");
    // }
    student.numPoints += numPoints;
    await student.save();
  });

  Transaction.newTransaction = async ({ studentId, teacherId, numPoints, Student }) => {
    await Transaction.create({ studentId, teacherId, numPoints }, { Student });
  };

  return Transaction;
};

export default transaction;
