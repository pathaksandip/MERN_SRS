const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  gender: String,
  sdob: Date,
  roll: Number,
  email: String,
  studentclass: String,
  admissionID: {
    type: Number,
    unique: true,
  },
  phone: String,
  guardianname: String,
});
module.exports = StudentSchema;
