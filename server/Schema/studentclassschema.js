const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  classNameS: {
    type: String,
    unique: true,
  },
  classNameNumeric: Number,
  assignedSubjects: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubjectDetails",
      },
      subjectName: String,
    },
  ],
});

const StudentClassDetails = mongoose.model("studentclassdetails", ClassSchema);

module.exports = StudentClassDetails;
