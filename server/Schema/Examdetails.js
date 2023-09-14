const mongoose = require('mongoose');

// Define the schema
const examSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  academicYear: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model
const Examdetails = mongoose.model('Examdetails', examSchema);

module.exports = Examdetails;
