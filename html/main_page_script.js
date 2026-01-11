// 随机生成 1~14 的数字
const randomIndex = Math.floor(Math.random() * 3) + 1;

// 设置随机背景图
document.querySelector('.background-container').style.backgroundImage =
  `url('${randomIndex}.png')`;

document.addEventListener('DOMContentLoaded', function () {
  // 检查登录状态
  const auth = window.auth;

  if (auth && auth.isLoggedIn()) {
    const user = auth.getUser();
    showUserAvatar(user);
    loadFeed();
  } else {
    setFeedStatus('Please log in to view the feed.');
  }

  // 登出功能
  document.getElementById('logoutBtn')?.addEventListener('click', function (e) {
    e.preventDefault();
    if (window.auth) {
      window.auth.logout();
    } else {
      clearLoginData();
    }
  });

  // 如果未登录但仍想尝试加载（需后端放行），可取消注释
  // loadFeed();
});

// 缓存评论数据与展开状态
const commentsCache = {};
const expandedSet = new Set();

// 加载动态列表
async function loadFeed() {
  const statusEl = document.getElementById('feedStatus');
  const feedList = document.getElementById('feedList');
  if (!feedList) return;

  setFeedStatus('Loading...');
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/posts`, {
      headers: {
        Authorization: window.auth?.getToken() || ''
      }
    });
    const data = await res.json();
    if (data.status !== 0) {
      setFeedStatus(data.message || 'Failed to load feed');
      return;
    }
    renderFeed(data.data || []);
    setFeedStatus('');
  } catch (e) {
    console.error(e);
    setFeedStatus('Network error');
  }
}

function renderFeed(posts) {
  commentsCache.lastPosts = posts;
  const feedList = document.getElementById('feedList');
  if (!feedList) return;

  if (!posts.length) {
    feedList.innerHTML = '<p>No posts yet. Be the first to share!</p>';
    return;
  }

  feedList.innerHTML = posts.map(post => {
    const created = new Date(post.created_at).toLocaleString();
    const imgSrc = normalizeImageUrl(post.image_url);
    const isMine = window.auth?.getUser()?.id === post.user_id;
    const expanded = expandedSet.has(post.id);
    const comments = commentsCache[post.id] || [];
    const avatarSrc = normalizeImageUrl(post.user_picture) || 'default_avatar.png';
    return `
      <div class="feature-card" data-post-id="${post.id}">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <img src="${avatarSrc}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">
          <div>
            <div style="font-weight:600;">${post.nickname || post.student_id || 'User'}</div>
            <div style="font-size:12px;color:#666;">${created}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;white-space:pre-wrap;">${escapeHtml(post.content)}</div>
        ${imgSrc ? `<img src="${imgSrc}" style="width:100%;border-radius:8px;object-fit:cover;margin-bottom:8px;">` : ''}
        <div style="display:flex;gap:12px;align-items:center;">
          <button class="like-btn" data-id="${post.id}" style="border:none;background:#e7f0fb;color:#1a5fb4;padding:8px 12px;border-radius:6px;cursor:pointer;">👍 ${post.like_count || 0}</button>
          <span style="color:#666;font-size:14px;">💬 ${post.comment_count || 0}</span>
          <button class="comment-toggle-btn" data-id="${post.id}" style="border:none;background:#f0f4f9;color:#1a5fb4;padding:6px 10px;border-radius:6px;cursor:pointer;">${expanded ? 'Hide' : 'Show'} comments</button>
          ${isMine ? `<button class="delete-btn" data-id="${post.id}" style="border:none;background:#fbeaea;color:#d9534f;padding:6px 10px;border-radius:6px;cursor:pointer;">Delete</button>` : ''}
        </div>
        <div style="margin-top:8px;display:flex;gap:8px;">
          <input type="text" placeholder="Add a comment" class="comment-input" style="flex:1;padding:8px;border:1px solid #d9d9d9;border-radius:6px;">
          <button class="comment-btn" data-id="${post.id}" style="border:none;background:#1a5fb4;color:#fff;padding:8px 12px;border-radius:6px;cursor:pointer;">Send</button>
        </div>
        ${expanded ? renderComments(comments) : ''}
      </div>
    `;
  }).join('');

  // 绑定点赞与评论事件（事件委托）
  feedList.onclick = async (e) => {
    const likeBtn = e.target.closest('.like-btn');
    const commentBtn = e.target.closest('.comment-btn');
    const toggleBtn = e.target.closest('.comment-toggle-btn');
    const delBtn = e.target.closest('.delete-btn');
    if (likeBtn) {
      await toggleLike(likeBtn.dataset.id, likeBtn);
    } else if (commentBtn) {
      const card = commentBtn.closest('.feature-card');
      const input = card.querySelector('.comment-input');
      await sendComment(commentBtn.dataset.id, input);
    } else if (toggleBtn) {
      await toggleComments(toggleBtn.dataset.id);
    } else if (delBtn) {
      await deletePost(delBtn.dataset.id);
    }
  };
}

function setFeedStatus(msg) {
  const statusEl = document.getElementById('feedStatus');
  if (statusEl) statusEl.textContent = msg || '';
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 规范化图片地址：如果是 /uploads 开头，则补上 API 基础 URL
function normalizeImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = window.API_BASE_URL || 'http://127.0.0.1:4040';
  if (url.startsWith('/api/uploads')) return `${baseUrl}${url.replace('/api', '')}`;
  if (url.startsWith('/api/upload')) return `${baseUrl}${url.replace('/api', '')}`;
  if (url.startsWith('/uploads')) return `${baseUrl}${url}`;
  return url;
}

function renderComments(list) {
  if (!list.length) return '<div style="margin-top:8px;color:#666;font-size:13px;">No comments yet.</div>';
  return `
    <div style="margin-top:8px;border-top:1px solid #eee;padding-top:8px;">
      ${list.map(c => `
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <img src="${c.user_picture || 'default_avatar.png'}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">
          <div>
            <div style="font-weight:600;font-size:13px;">${escapeHtml(c.nickname || 'User')}</div>
            <div style="font-size:13px;color:#444;white-space:pre-wrap;">${escapeHtml(c.content)}</div>
            <div style="font-size:12px;color:#888;">${new Date(c.created_at).toLocaleString()}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function toggleLike(postId, btn) {
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        Authorization: window.auth?.getToken() || ''
      }
    });
    const data = await res.json();
    if (data.status === 0 && btn) {
      const newCount = data.data?.like_count ?? 0;
      btn.innerHTML = `👍 ${newCount}`;
    } else {
      alert(data.message || 'Like failed');
    }
  } catch (e) {
    console.error(e);
    alert('Network error');
  }
}

async function sendComment(postId, input) {
  const content = input?.value.trim();
  if (!content) return;
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.auth?.getToken() || ''
      },
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    if (data.status === 0) {
      input.value = '';
      await toggleComments(postId, true);
      loadFeed();
    } else {
      alert(data.message || 'Comment failed');
    }
  } catch (e) {
    console.error(e);
    alert('Network error');
  }
}

async function toggleComments(postId, forceRefresh = false) {
  if (!forceRefresh && expandedSet.has(Number(postId))) {
    expandedSet.delete(Number(postId));
    renderFeed(commentsCache.lastPosts || []);
    return;
  }
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/posts/${postId}/comment`, {
      headers: { Authorization: window.auth?.getToken() || '' }
    });
    const data = await res.json();
    if (data.status === 0) {
      commentsCache[postId] = data.data || [];
      expandedSet.add(Number(postId));
      renderFeed(commentsCache.lastPosts || []);
    } else {
      alert(data.message || 'Failed to load comments');
    }
  } catch (e) {
    console.error(e);
    alert('Network error');
  }
}

async function deletePost(postId) {
  if (!confirm('Delete this post?')) return;
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: window.auth?.getToken() || '' }
    });
    const data = await res.json();
    if (data.status === 0) {
      alert('Deleted');
      loadFeed();
    } else {
      alert(data.message || 'Delete failed');
    }
  } catch (e) {
    console.error(e);
    alert('Network error');
  }
}
// 显示用户头像 - 在 Campus Feed 右上角
function showUserAvatar(userData) {
  const feedAvatarContainer = document.getElementById('feedUserAvatar');
  const feedAvatarImg = document.getElementById('feedAvatarImg');
  
  if (feedAvatarContainer && feedAvatarImg) {
    // 规范化头像 URL
    let avatarSrc = userData.picture || 'default_avatar.png';
    if (avatarSrc && !avatarSrc.startsWith('http://') && !avatarSrc.startsWith('https://') && avatarSrc !== 'default_avatar.png') {
      const baseUrl = window.API_BASE_URL || 'http://127.0.0.1:4040';
      if (avatarSrc.startsWith('/uploads')) {
        avatarSrc = `${baseUrl}${avatarSrc}`;
      } else if (avatarSrc.startsWith('/api/uploads') || avatarSrc.startsWith('/api/upload')) {
        avatarSrc = `${baseUrl}${avatarSrc.replace('/api', '')}`;
      }
    }
    
    feedAvatarImg.src = avatarSrc;
    feedAvatarContainer.style.display = 'block';
  }
}

// 清除登录数据
function clearLoginData() {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  window.location.href = 'log in.html';
}