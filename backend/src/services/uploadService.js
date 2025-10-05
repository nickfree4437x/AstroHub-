// src/services/uploadService.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");

const USE_S3 = !!process.env.AWS_S3_BUCKET;
const UPLOAD_DIR = process.env.UPLOAD_LOCAL_PATH || path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2,8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: (process.env.MAX_UPLOAD_MB ? Number(process.env.MAX_UPLOAD_MB) : 20) * 1024 * 1024 }
});

// if S3 configured, provide helper to upload file from local path to s3
async function uploadToS3(localPath, key) {
  if (!USE_S3) throw new Error("S3 not configured");
  const s3 = new AWS.S3({ region: process.env.AWS_REGION });
  const body = fs.createReadStream(localPath);
  await s3.upload({ Bucket: process.env.AWS_S3_BUCKET, Key: key, Body: body, ACL: "public-read" }).promise();
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { upload, UPLOAD_DIR, uploadToS3, USE_S3 };
