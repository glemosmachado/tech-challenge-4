const express = require("express");
const bcrypt = require("bcryptjs");
const requireTeacher = require("./middlewares/requireTeacher");
const Teacher = require("./models/Teacher");

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
      Teacher.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Teacher.countDocuments(),
    ]);

    res.json({ items, page, limit, total });
  } catch (e) {
    console.log("teachers list error:", e);
    res.status(500).json({ message: "Failed to list teachers" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const { name, email, password, passwordHash: incomingHash, area } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    let passwordHash = incomingHash;

    if (!passwordHash) {
      if (!password) {
        return res.status(400).json({ message: "password is required" });
      }
      passwordHash = await bcrypt.hash(String(password), 10);
    }

    const normalizedEmail = normalizeEmail(email);

    const exists = await Teacher.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const created = await Teacher.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      area: area ? String(area).trim() : undefined,
    });

    res.status(201).json(created);
  } catch (e) {
    console.log("teachers create error:", e);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

router.get("/:id", requireTeacher, async (req, res) => {
  try {
    const item = await Teacher.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Teacher not found" });
    res.json(item);
  } catch (e) {
    console.log("teachers get error:", e);
    res.status(500).json({ message: "Failed to get teacher" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const { name, email, password, area } = req.body;

    const updates = {};
    if (name) updates.name = String(name).trim();
    if (email) updates.email = normalizeEmail(email);
    if (typeof area !== "undefined") updates.area = area ? String(area).trim() : undefined;
    if (password) updates.passwordHash = await bcrypt.hash(String(password), 10);

    const updated = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Teacher not found" });

    res.json(updated);
  } catch (e) {
    console.log("teachers update error:", e);
    res.status(500).json({ message: "Failed to update teacher" });
  }
});

router.delete("/:id", requireTeacher, async (req, res) => {
  try {
    if (req.user?.id && String(req.user.id) === String(req.params.id)) {
      return res.status(403).json({ message: "You cannot delete your own account" });
    }

    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Teacher not found" });

    res.json({ ok: true });
  } catch (e) {
    console.log("teachers delete error:", e);
    res.status(500).json({ message: "Failed to delete teacher" });
  }
});

module.exports = router;
