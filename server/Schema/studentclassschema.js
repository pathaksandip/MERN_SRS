const mongoose = require("mongoose");
const ClassSchema = new mongoose.Schema({
  classNameS: {
    type: String,
    unique: true,
  },
  classNameNumeric: Number,
});
ClassSchema.index({ classNameS: 1 }, { unique: true });
module.exports = ClassSchema;
