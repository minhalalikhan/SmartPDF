// server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));

// Make sure uploads directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    cb(null, `${ts}-${safeOriginal}`);
  },
});

// Accept only PDFs
const fileFilter = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"));
};

// Optional: set a (large) max size if you still want a ceiling (e.g., 200MB)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE ? Number(process.env.MAX_FILE_SIZE) : undefined,
    files: 1,
  },
});

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOAD_DIR));

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { filename, originalname, size, mimetype } = req.file;
  const publicUrl = `${process.env.PUBLIC_URL || "http://localhost:4000"}/uploads/${filename}`;

  return res.status(201).json({
    message: "Upload successful",
    file: {
      originalName: originalname,
      storedName: filename,
      size,
      mimetype,
      url: publicUrl,
    },
  });
});

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File too large" });
  }
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`File upload server listening on http://localhost:${PORT}`);
});
