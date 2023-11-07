const mongoose = require("mongoose");
const ObtainedMarksSchema = new mongoose.Schema({
  studentName: String, // Student's name
  rollNumber: String, // Student's roll number
  class: String, // Class name or identifier
  examType: String, // Type of exam
  fullMarks: Number, // Full marks for the subject
  passMarks: Number, // Pass marks for the subject
  obtainedMarks: Number,
});
const ObtainedMarks = mongoose.model("ObtainedMarks", ObtainedMarksSchema);

module.exports = ObtainedMarks;
