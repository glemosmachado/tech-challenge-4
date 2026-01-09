const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    area: { type: String, required: false, trim: true }, // opcional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);