const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// 配置 Cloudinary（从环境变量读取）
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 配置 Multer 使用内存存储（不保存到磁盘）
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 限制文件大小为 10MB
});

// 单文件上传，字段名 file
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.cc('No file uploaded');
  
  try {
    // 将文件缓冲区转换为 base64 字符串上传到 Cloudinary
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // 上传到 Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'dorm', // 在 Cloudinary 中创建 folder 目录存放图片
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' } // 限制最大尺寸
      ]
    });
    
    // 返回 Cloudinary 的完整 URL（secure_url 是 HTTPS 链接）
    res.send({
      status: 0,
      message: '上传成功',
      data: { url: result.secure_url }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.cc('上传失败：' + (error.message || '未知错误'));
  }
});

module.exports = router;

