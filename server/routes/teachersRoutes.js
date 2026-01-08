const express = require("express");
const Teacher = require("../models/Teacher");
const requireTeacher = require("../middlewares/requireTeacher");

const router = express.Router();

router.get("/", requireTeacher, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      Teacher.countDocuments({}),
      Teacher.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(total / limit);
    return res.json({ items, page, limit, total, totalPages });
  } catch {
    return res.status(500).json({ message: "Failed to list teachers" });
  }
});

router.get("/:id", requireTeacher, async (req, res) => {
  try {
    const item = await Teacher.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Teacher not found" });
    return res.json(item);
  } catch {
    return res.status(400).json({ message: "Invalid id" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const { name, email, department } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const created = await Teacher.create({
      name,
      email,
      department: department || ""
    });

    return res.status(201).json(created);
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("duplicate key")) {
      return res.status(409).json({ message: "Teacher email already exists" });
    }
    return res.status(500).json({ message: "Failed to create teacher" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Teacher not found" });
    return res.json(updated);
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("duplicate key")) {
      return res.status(409).json({ message: "Teacher email already exists" });
    }
    return res.status(400).json({ message: "Failed to update teacher" });
  }
});

router.delete("/:id", requireTeacher, async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Teacher not found" });
    return res.json({ message: "Teacher deleted" });
  } catch {
    return res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;
