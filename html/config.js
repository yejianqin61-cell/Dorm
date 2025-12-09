// 前端 API 配置
// 优先级：window.API_BASE_URL > 环境变量 > 默认值
// 生产环境：使用 Railway 后端 URL
// 本地开发：使用 http://127.0.0.1:4040
window.API_BASE_URL = window.API_BASE_URL || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://127.0.0.1:4040' 
    : 'https://dorm-production.up.railway.app');

// 在 Vercel 中，可以通过环境变量 VITE_API_URL 设置
// 本地开发时自动使用 http://127.0.0.1:4040

