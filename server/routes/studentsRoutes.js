const express = require("express");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middlewares/requireAuth");
const requireTeacher = require("../middlewares/requireTeacher");
const Student = require("../models/Student");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const q = String(req.query.q || "").trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { rm: { $regex: q, $options: "i" } },
            { registration: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      Student.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Student.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    console.log("students list error:", e);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const rm = String(req.body.rm || req.body.registration || "").trim();
    const password = String(req.body.password || "").trim();

    if (!name || !email || !rm || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Student.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const created = await Student.create({
      name,
      email,
      rm,
      password: hashed,
    });

    const safe = created.toObject();
    delete safe.password;

    res.status(201).json(safe);
  } catch (e) {
    console.log("students create error:", e);
    res.status(500).json({ message: "Failed to create student" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Student.findById(req.params.id).select("-password");
    if (!item) return res.status(404).json({ message: "Student not found" });
    res.json(item);
  } catch (e) {
    console.log("students read error:", e);
    res.status(500).json({ message: "Failed to fetch student" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name || "").trim();
    if (req.body.email !== undefined) updates.email = normalizeEmail(req.body.email);
    if (req.body.rm !== undefined) updates.rm = String(req.body.rm || "").trim();
    if (req.body.registration !== undefined) updates.rm = String(req.body.registration || "").trim();

    const password = String(req.body.password || "").trim();
    if (password) updates.password = await bcrypt.hash(password, 10);

    if (updates.email) {
      const exists = await Student.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (exists) return res.status(409).json({ message: "Email already registered" });
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

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