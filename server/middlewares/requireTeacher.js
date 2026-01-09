const requireAuth = require("./requireAuth");

module.exports = function requireTeacher(req, res, next) {
  if (req.headers.authorization) {
    return requireAuth(req, res, () => {
      if (req.user?.role !== "teacher") {
        return res.status(403).json({ message: "Unauthorized: teacher only" });
      }
      return next();
    });
  }

  // Fallback 
  const userType = req.headers["x-user-type"];
  if (userType === "teacher") return next();

  return res.status(403).json({ message: "Unauthorized: teacher only" });
};
