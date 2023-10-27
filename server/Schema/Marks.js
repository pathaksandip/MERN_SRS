// marks.js
const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  selectedExam: String,
  selectedClass: String,
  selectedClassName: String,
  examName:String,
  subjectMarks: [
    {
      subjectName: String,
      fullMarks: {
        type: Number,
        required: true,
      },
      passMarks: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Marks", marksSchema);
