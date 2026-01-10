const requireAuth = require("./requireAuth");

module.exports = function requireTeacher(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user?.role !== "teacher") {
      return res.status(403).json({ message: "Unauthorized: teacher only" });
    }
    return next();
  });
};
