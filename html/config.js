// 前端 API 配置
// 优先级：window.API_BASE_URL > 环境变量 > 自动判断 > 默认值

// 自动判断：根据当前访问的域名选择 API 地址
let defaultApiUrl = 'http://127.0.0.1:4040'; // 本地开发默认值

if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  // 如果是生产环境（非 localhost），使用 Railway 生产地址
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    defaultApiUrl = 'https://dorm-production.up.railway.app';
  }
}

window.API_BASE_URL = window.API_BASE_URL || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) || 
  defaultApiUrl;

// 调试：在控制台输出 API 地址
if (typeof console !== 'undefined') {
  console.log('🔧 API 配置:', {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
    apiBaseUrl: window.API_BASE_URL,
    envVar: typeof process !== 'undefined' && process.env ? process.env.VITE_API_URL : 'N/A'
  });
}

// 在 Vercel 中，环境变量会通过构建时注入
// 本地开发时使用默认值

