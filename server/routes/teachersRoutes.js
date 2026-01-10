const express = require("express");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middlewares/requireAuth");
const requireTeacher = require("../middlewares/requireTeacher");
const Teacher = require("../models/Teacher");

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
            { area: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      Teacher.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Teacher.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) || 1 });
  } catch (e) {
    console.log("teachers list error:", e);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const area = String(req.body.area || "").trim();
    const password = String(req.body.password || "").trim();

    if (!name || !email || !area || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Teacher.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const created = await Teacher.create({
      name,
      email,
      area,
      password: hashed,
    });

    const safe = created.toObject();
    delete safe.password;

    res.status(201).json(safe);
  } catch (e) {
    console.log("teachers create error:", e);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Teacher.findById(req.params.id).select("-password");
    if (!item) return res.status(404).json({ message: "Teacher not found" });
    res.json(item);
  } catch (e) {
    console.log("teachers read error:", e);
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name || "").trim();
    if (req.body.email !== undefined) updates.email = normalizeEmail(req.body.email);
    if (req.body.area !== undefined) updates.area = String(req.body.area || "").trim();

    const password = String(req.body.password || "").trim();
    if (password) updates.password = await bcrypt.hash(password, 10);

    if (updates.email) {
      const exists = await Teacher.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (exists) return res.status(409).json({ message: "Email already registered" });
    }

    const updated = await Teacher.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated) return res.status(404).json({ message: "Teacher not found" });

    res.json(updated);
  } catch (e) {
    console.log("teachers update error:", e);
    res.status(500).json({ message: "Failed to update teacher" });
  }
});

router.delete("/:id", requireTeacher, async (req, res) => {
  try {
    const requesterId = req.user?.sub || req.user?.id;
    if (requesterId && String(requesterId) === String(req.params.id)) {
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