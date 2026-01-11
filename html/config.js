// 前端 API 配置
// 优先级：window.API_BASE_URL > 环境变量 > 自动判断 > 默认值

// 自动判断：根据当前访问的域名选择 API 地址
let defaultApiUrl = 'http://127.0.0.1:4040'; // 本地开发默认值

// 注意：生产环境必须通过 Vercel 环境变量设置 VITE_API_URL
// 或者在 Railway 生成公共域名后，更新下面的 URL
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  // 如果是生产环境（非 localhost），需要设置正确的 Railway 公共 URL
  // 请替换为你在 Railway 生成的公共域名（格式：https://xxx.up.railway.app）
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // TODO: 替换为实际的 Railway 公共 URL
    // defaultApiUrl = 'https://你的服务名.up.railway.app';
    // 暂时使用空字符串，强制使用环境变量
    defaultApiUrl = ''; // 必须通过环境变量设置
  }
}

// 优先级：window.API_BASE_URL > 环境变量 > 默认值
window.API_BASE_URL = window.API_BASE_URL || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) || 
  defaultApiUrl;

// 如果没有配置 API 地址，显示警告
if (!window.API_BASE_URL) {
  console.error('❌ 错误：未配置 API_BASE_URL！');
  console.error('请在 Vercel 环境变量中设置 VITE_API_URL，或在 Railway 生成公共域名后更新 config.js');
}

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

