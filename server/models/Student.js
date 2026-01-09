const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    registration: { type: String, required: false, trim: true }, // opcional (RM/RA)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
