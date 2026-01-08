const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registration: { type: String, required: true, trim: true, unique: true },
    course: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
