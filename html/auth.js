// auth.js - 保存到 js/auth.js
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('userToken');
    this.userData = null;
    this.loadUserData();
  }

  loadUserData() {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        this.userData = JSON.parse(userDataStr);
      } catch (e) {
        console.error('解析用户数据失败:', e);
        this.clear();
      }
    }
  }

  isLoggedIn() {
    return !!this.token && !!this.userData;
  }

  getUser() {
    return this.userData;
  }

  getToken() {
    return this.token;
  }

  setSession(token, userData) {
    this.token = token;
    this.userData = userData;
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  clear() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    this.token = null;
    this.userData = null;
  }

  logout() {
    this.clear();
    window.location.href = 'log in.html';
  }
}

// 创建全局实例
window.auth = new AuthManager();

// 自动检查登录状态的函数
function initAuth() {
  const auth = window.auth;

  // 如果是需要登录的页面，但用户未登录，跳转到登录页
  const protectedPages = ['myprofile.html', 'my.html', 'publish.html', 'pubulish.html', 'create_post.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !auth.isLoggedIn()) {
    window.location.href = 'log in.html';
    return;
  }

  // 更新页面上的用户信息
  if (auth.isLoggedIn()) {
    const user = auth.getUser();

    // 更新导航栏头像
    const userAvatarNav = document.getElementById('userAvatarNav');
    if (userAvatarNav) {
      userAvatarNav.src = user.picture || 'default_avatar.png';
    }

    // 隐藏登录按钮，显示用户区域
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');

    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initAuth);