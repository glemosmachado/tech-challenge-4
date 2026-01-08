const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    department: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
