// 前端 API 配置
// 本地开发：使用 http://127.0.0.1:4040
// 生产环境：使用 Railway 后端 URL
(function() {
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === '';
  
  if (isLocal) {
    window.API_BASE_URL = 'http://127.0.0.1:4040';
  } else {
    // 生产环境：使用 Railway 后端 URL
    // 如果 Railway URL 有变化，请在这里更新
    window.API_BASE_URL = 'https://dorm-production.up.railway.app';
  }
  
  // 调试信息（可在浏览器控制台查看）
  console.log('API_BASE_URL:', window.API_BASE_URL);
})();

