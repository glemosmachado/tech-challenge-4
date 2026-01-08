const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPassword || !secret) {
    return res.status(500).json({
      message: "Server not configured: ADMIN_EMAIL/ADMIN_PASSWORD/JWT_SECRET missing"
    });
  }

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "teacher", email }, secret, { expiresIn: "7d" });

  return res.json({
    token,
    user: { role: "teacher", email }
  });
});

module.exports = router;
