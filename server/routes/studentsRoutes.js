const express = require("express");
const bcrypt = require("bcryptjs");
const requireTeacher = require("../middlewares/requireTeacher");
const Student = require("../models/Student");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.get("/", requireTeacher, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Student.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Student.countDocuments(),
    ]);

    res.json({ items, page, limit, total });
  } catch (e) {
    console.log("students list error:", e);
    res.status(500).json({ message: "Failed to list students" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const { name, email, password, registration } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const exists = await Student.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(String(password), 10);

    const created = await Student.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      registration: registration ? String(registration).trim() : undefined,
    });

    res.status(201).json(created);
  } catch (e) {
    console.log("students create error:", e);
    res.status(500).json({ message: "Failed to create student" });
  }
});

router.get("/:id", requireTeacher, async (req, res) => {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Student not found" });
    res.json(item);
  } catch (e) {
    console.log("students get error:", e);
    res.status(500).json({ message: "Failed to get student" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const { name, email, password, registration } = req.body;

    const updates = {};
    if (name) updates.name = String(name).trim();
    if (email) updates.email = normalizeEmail(email);
    if (typeof registration !== "undefined") {
      updates.registration = registration ? String(registration).trim() : undefined;
    }
    if (password) updates.passwordHash = await bcrypt.hash(String(password), 10);

    const updated = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json(updated);
  } catch (e) {
    console.log("students update error:", e);
    res.status(500).json({ message: "Failed to update student" });
  }
});

router.delete("/:id", requireTeacher, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ ok: true });
  } catch (e) {
    console.log("students delete error:", e);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

module.exports = router;