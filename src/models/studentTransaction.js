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
      references: {
        model: "students",
        key: "id",
      },
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Student);
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

  return Transaction;
};

export default transaction;
