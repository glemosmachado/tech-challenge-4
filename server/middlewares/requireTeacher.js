const jwt = require("jsonwebtoken");

function getBearerToken(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

function getRole(req) {
  const token = getBearerToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload?.role || null;
    } catch {
      return null;
    }
  }

  // fallback
  const headerRole = req.headers["x-user-type"];
  if (headerRole === "teacher") return "teacher";
  if (headerRole === "student") return "student";
  return null;
}

function requireTeacher(req, res, next) {
  const role = getRole(req);
  if (role !== "teacher") {
    return res.status(401).json({ message: "Unauthorized: teacher only" });
  }
  return next();
}

module.exports = requireTeacher;
