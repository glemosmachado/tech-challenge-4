const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const teachersRoutes = require("./routes/teachersRoutes");
const studentsRoutes = require("./routes/studentsRoutes");

const Teacher = require("./models/Teacher");
const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-type"],
  })
);

app.get("/", (req, res) => {
  res.json({ ok: true, service: "tech-challenge-4-api" });
});

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/teachers", teachersRoutes);
app.use("/students", studentsRoutes);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function ensureAdminTeacher() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL);
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || !password) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set. Skipping admin seed.");
    return;
  }

  const exists = await Teacher.findOne({ email });
  if (exists) {
    console.log(`Admin teacher already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Teacher.create({
    name: "Admin Professor",
    email,
    passwordHash,
  });

  console.log(`Admin teacher created: ${email}`);
}

async function ensureDefaultStudentIfConfigured() {
  const email = normalizeEmail(process.env.STUDENT_EMAIL);
  const password = String(process.env.STUDENT_PASSWORD || "");

  if (!email || !password) {
    console.log("STUDENT_EMAIL/STUDENT_PASSWORD not set. Skipping student seed.");
    return;
  }

  const exists = await Student.findOne({ email });
  if (exists) {
    console.log(`Default student already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Student.create({
    name: "Aluno Padrão",
    email,
    passwordHash,
  });

  console.log(`Default student created: ${email}`);
}

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI missing");
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    await ensureAdminTeacher();
    await ensureDefaultStudentIfConfigured();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
