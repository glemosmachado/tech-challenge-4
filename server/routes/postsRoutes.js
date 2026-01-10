const express = require("express");
const Post = require("../models/Post");
const requireTeacher = require("../middlewares/requireTeacher");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return res.json(posts);
  } catch {
    return res.status(500).json({ message: "Failed to list posts" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving post" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  } catch {
    return res.status(400).json({ message: "Invalid id" });
  }
});

router.post("/", requireTeacher, async (req, res) => {
  try {
    const { title, content, author } = req.body || {};
    if (!title || !content || !author) {
      return res.status(400).json({ message: "title, content and author are required" });
    }

    const created = await Post.create({ title, content, author });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err?.message || "Failed to create post" });
  }
});

router.put("/:id", requireTeacher, async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Post not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err?.message || "Failed to update post" });
  }
});

router.delete("/:id", requireTeacher, async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err?.message || "Failed to delete post" });
  }
});

module.exports = router;