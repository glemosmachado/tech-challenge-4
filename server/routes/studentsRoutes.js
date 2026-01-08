const express = require("express");
const Student = require("../models/Student");
const requireTeacher = require("../middlewares/requireTeacher");

const router = express.Router();

router.get("/", requireTeacher, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      Student.countDocuments({}),
      Student.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(total / limit);
    return res.json({ items, page, limit, total, totalPages });
  } catch {
    return res.status(500).json({ message: "Failed to list students" });
  }
});

router.get("/:id", requireTeacher, async (req, res) => {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Student not found" });
    return res.json(item);
  } catch {
    return res.status(400).json({ message: "Invalid id" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const { name, registration, course } = req.body || {};
    if (!name || !registration) {
      return res.status(400).json({ message: "name and registration are required" });
    }

    const created = await Student.create({
      name,
      registration,
      course: course || ""
    });

    return res.status(201).json(created);
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("duplicate key")) {
      return res.status(409).json({ message: "Student registration already exists" });
    }
    return res.status(500).json({ message: "Failed to create student" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Student not found" });
    return res.json(updated);
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("duplicate key")) {
      return res.status(409).json({ message: "Student registration already exists" });
    }
    return res.status(400).json({ message: "Failed to update student" });
  }
});

router.delete("/:id", requireTeacher, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    return res.json({ message: "Student deleted" });
  } catch {
    return res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;
