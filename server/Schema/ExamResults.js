const mongoose = require("mongoose");

const StudentSubjectSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  obtainedMarks: {
    type: String,
  },
});

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  rollNumber: {
    type: Number,
  },
  subjects: [StudentSubjectSchema],
});

const ExamResultSchema = new mongoose.Schema({
  class: {
    type: String,
  },
  examType: {
    type: String,
  },
  students: [StudentSchema],
});

const ExamResult = mongoose.model("exammarks", ExamResultSchema);

module.exports = ExamResult;
