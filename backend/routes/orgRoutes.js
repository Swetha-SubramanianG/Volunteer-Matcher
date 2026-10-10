import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import Organization from "../models/Organization.js";

const router = express.Router();

/* -----------------------------
   CERTIFICATE UPLOAD (Multer)
------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/certificates/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

/* -----------------------------
   ORG SIGNUP (with certificate)
------------------------------*/
router.post("/signup", upload.single("certificate"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Organization.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Organization already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const organization = new Organization({
      name,
      email,
      password: hashed,
      certificateUrl: `/certificates/${req.file.filename}`,
    });

    await organization.save();
    res.json({ message: "Organization signed up, awaiting verification" });

  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

/* -----------------------------
   ORG LOGIN (only if verified)
------------------------------*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const org = await Organization.findOne({ email });
  if (!org) return res.status(400).json({ error: "Invalid credentials" });

  if (!org.verified)
    return res.status(401).json({ error: "Organization not verified yet" });

  const valid = await bcrypt.compare(password, org.password);
  if (!valid) return res.status(400).json({ error: "Incorrect password" });

  const token = jwt.sign({ id: org._id }, process.env.JWT_SECRET);

  res.json({
    message: "Login successful",
    token,
    org: { name: org.name, email: org.email }
  });
});

export default router;
