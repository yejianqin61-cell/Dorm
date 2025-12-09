const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 存储到 /uploads，文件名加时间戳
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const upload = multer({ storage });

// 单文件上传，字段名 file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.cc('No file uploaded');
  const url = `/uploads/${req.file.filename}`;
  res.send({
    status: 0,
    message: '上传成功',
    data: { url }
  });
});

module.exports = router;

