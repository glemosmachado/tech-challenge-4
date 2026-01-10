const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

const router = express.Router();

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

router.post("/login", async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "role, email and password are required" });
    }

    const normalizedRole = String(role).toLowerCase();
    if (normalizedRole !== "teacher" && normalizedRole !== "student") {
      return res.status(400).json({ message: "role must be 'teacher' or 'student'" });
    }

    const Model = normalizedRole === "teacher" ? Teacher : Student;

    const user = await Model.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.passwordHash) return res.status(401).json({ message: "User has no password set" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({
      sub: String(user._id),
      role: normalizedRole,
      email: user.email,
    });

    return res.json({
      token,
      user: {
        id: String(user._id),
        role: normalizedRole,
        email: user.email,
        name: user.name || null,
      },
    });
  } catch (e) {
    console.log("auth/login error:", e);
    return res.status(500).json({ message: "Failed to login" });
  }
});

module.exports = router;