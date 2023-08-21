const mongoose = require("mongoose");
const SubjectSchema = new mongoose.Schema({
  SubjectName: {
    type: String,
    unique: true,
  },
  SubjectCode: String,
  SubjectCreditHour: Number,
});
const SubjectDetails = mongoose.model("subject", SubjectSchema);
module.exports = SubjectDetails;
