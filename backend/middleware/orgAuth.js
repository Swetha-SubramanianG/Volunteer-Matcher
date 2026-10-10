const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

const orgAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Organization token required" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const org = await Organization.findById(decoded.id);

    if (!org) {
      return res.status(403).json({ message: "Organization not found" });
    }

    req.org = org;
    next();
  } catch (error) {
    console.error("orgAuth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = orgAuth;
