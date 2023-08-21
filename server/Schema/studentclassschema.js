const mongoose = require("mongoose");
const ClassSchema = new mongoose.Schema({
  classNameS: {
    type: String,
    unique: true,
  },
  classNameNumeric: Number,
});
const StudentClassDetails = mongoose.model("studentclassdetails", ClassSchema);

module.exports = StudentClassDetails;
