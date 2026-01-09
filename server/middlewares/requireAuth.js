const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET missing" });

    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};