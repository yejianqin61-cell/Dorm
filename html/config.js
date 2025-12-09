// 前端 API 配置
// 优先级：window.API_BASE_URL > 环境变量 > 默认值
window.API_BASE_URL = window.API_BASE_URL || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) || 
  'http://127.0.0.1:4040';

// 在 Vercel 中，环境变量会通过构建时注入
// 本地开发时使用默认值

