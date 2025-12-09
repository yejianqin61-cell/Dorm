# XMUM Dorm 部署指南

## 📋 部署架构

- **前端**: Vercel（免费）
- **后端**: Railway.app（免费额度）
- **数据库**: Railway MySQL 或 PlanetScale（免费）
- **域名**: Namecheap / Cloudflare

---

## 🚀 第一步：准备代码

### 1. 确保代码已提交到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/Dorm.git
git push -u origin main
```

### 2. 创建 `.env` 文件（本地开发用，不要提交）

在项目根目录创建 `.env` 文件：

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=my_db
JWT_SECRET=你的JWT密钥（随机字符串）
JWT_EXPIRES_IN=10h
PORT=4040
```

**⚠️ 重要：`.env` 文件已在 `.gitignore` 中，不会提交到 Git**

---

## 🗄️ 第二步：部署数据库（Railway）

### 选项 A：Railway MySQL（推荐）

1. 访问 https://railway.app
2. 用 GitHub 账号登录
3. 点击 "New Project" → "Provision MySQL"
4. 等待数据库创建完成
5. 点击数据库服务 → "Variables" 标签
6. 记录以下信息：
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### 选项 B：PlanetScale（备选）

1. 访问 https://planetscale.com
2. 注册账号（GitHub 登录）
3. 创建数据库
4. 获取连接字符串

---

## 🔧 第三步：部署后端（Railway）

1. **创建新服务**
   - Railway Dashboard → "New Project" → "Deploy from GitHub repo"
   - 选择你的 `Dorm` 仓库

2. **配置环境变量**
   - 点击服务 → "Variables" 标签
   - 添加以下变量：

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
JWT_SECRET=你的随机密钥（至少32字符）
JWT_EXPIRES_IN=10h
PORT=${{PORT}}
```

   **注意**：如果数据库在 Railway，可以用 `${{MySQL.变量名}}` 引用

3. **生成 JWT_SECRET**
   ```bash
   # 在终端运行
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   复制输出的字符串作为 `JWT_SECRET`

4. **部署**
   - Railway 会自动检测到 `package.json` 并部署
   - 等待部署完成（约 2-3 分钟）

5. **获取后端 URL**
   - 部署完成后，Railway 会生成一个 URL，例如：`https://your-app.up.railway.app`
   - 记录这个 URL，后面配置前端要用

6. **初始化数据库表**
   - 在 Railway MySQL 的 "Data" 标签中执行 SQL，或使用 MySQL 客户端连接
   - 执行以下 SQL（参考之前的建表语句）：

```sql
USE your_database_name;

CREATE TABLE ev_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  email VARCHAR(255),
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ev_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES ev_users(id)
);

CREATE TABLE ev_post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES ev_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE
);

CREATE TABLE ev_post_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES ev_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE
);
```

---

## 🎨 第四步：部署前端（Vercel）

1. **访问 Vercel**
   - https://vercel.com
   - 用 GitHub 账号登录

2. **导入项目**
   - "Add New..." → "Project"
   - 选择你的 `Dorm` 仓库
   - Framework Preset: **Other**
   - Root Directory: `html`
   - Build Command: （留空）
   - Output Directory: `html`

3. **配置环境变量**
   - Project Settings → Environment Variables
   - 添加：
     ```
     VITE_API_URL=https://your-railway-app.up.railway.app
     ```
   （替换为你的 Railway 后端 URL）

4. **修改前端代码中的 API 地址**
   - 需要修改所有 HTML/JS 文件中的硬编码 API 地址
   - 见下方"修改前端代码"部分

5. **部署**
   - 点击 "Deploy"
   - 等待完成（约 1-2 分钟）
   - 获得前端 URL，例如：`https://dorm.vercel.app`

---

## 🌐 第五步：购买并配置域名

### 购买域名

1. **Namecheap**
   - 访问 https://www.namecheap.com
   - 搜索想要的域名（如 `xmumdorm.com`）
   - 加入购物车并结账（约 $10-15/年）

2. **Cloudflare**（推荐，更便宜）
   - 访问 https://www.cloudflare.com/products/registrar
   - 搜索并购买域名

### 配置 DNS

#### 前端域名（Vercel）

1. **在 Vercel 添加域名**
   - Project Settings → Domains
   - 输入你的域名（如 `xmumdorm.com`）
   - Vercel 会显示需要添加的 DNS 记录

2. **在域名提供商添加 DNS**
   - 登录 Namecheap/Cloudflare
   - 进入域名管理 → DNS 设置
   - 添加 Vercel 要求的 CNAME 或 A 记录

#### 后端域名（Railway，可选）

1. **在 Railway 添加自定义域名**
   - Service Settings → Networking
   - 添加域名（如 `api.xmumdorm.com`）
   - 按照提示配置 DNS

2. **更新前端环境变量**
   - 在 Vercel 中更新 `VITE_API_URL` 为新的后端域名

---

## 🔧 修改前端代码以支持环境变量

需要修改以下文件，将硬编码的 API 地址改为从环境变量读取：

### 1. 创建 `html/config.js`

```javascript
// 前端 API 配置
window.API_BASE_URL = window.API_BASE_URL || 
  (typeof process !== 'undefined' && process.env.VITE_API_URL) || 
  'http://127.0.0.1:4040';
```

### 2. 修改所有 HTML 文件

在每个 HTML 文件的 `<head>` 中添加：

```html
<script src="config.js"></script>
```

### 3. 修改所有 fetch 调用

将 `http://127.0.0.1:4040` 替换为 `${window.API_BASE_URL}`

例如：
```javascript
// 之前
fetch('http://127.0.0.1:4040/api/posts')

// 之后
fetch(`${window.API_BASE_URL}/api/posts`)
```

**需要修改的文件：**
- `html/log in.html`
- `html/register.html`
- `html/myprofile.html`
- `html/create_post.html`
- `html/main_page_script.js`
- `html/auth.js`

---

## ✅ 部署检查清单

- [ ] 代码已提交到 GitHub
- [ ] Railway 数据库已创建并初始化表结构
- [ ] Railway 后端已部署，环境变量已配置
- [ ] 后端 URL 可访问（测试：`https://your-app.up.railway.app/api/posts`）
- [ ] Vercel 前端已部署
- [ ] 前端代码中的 API 地址已改为环境变量
- [ ] 域名已购买并配置 DNS
- [ ] 域名已绑定到 Vercel
- [ ] HTTPS 证书已自动配置（Vercel 自动）
- [ ] 测试登录、注册、发布动态功能

---

## 🐛 常见问题

### 1. CORS 错误
- 确保后端 `app.js` 中已启用 `cors()`
- 检查前端请求的域名是否正确

### 2. 数据库连接失败
- 检查 Railway 环境变量是否正确
- 确认数据库服务已启动
- 检查防火墙设置

### 3. 图片上传失败
- 确认 `uploads/` 目录存在
- Railway 的文件系统是临时的，建议改用对象存储（如 Cloudinary、AWS S3）

### 4. 环境变量不生效
- Vercel 需要重新部署才能读取新的环境变量
- 检查变量名是否正确（Vercel 用 `VITE_` 前缀）

---

## 📞 需要帮助？

如果遇到问题，检查：
1. Railway 日志：Service → Deployments → 点击最新部署 → Logs
2. Vercel 日志：Project → Deployments → 点击最新部署 → Functions Logs
3. 浏览器控制台：F12 → Console 和 Network 标签

---

## 🎉 完成！

部署完成后，你的应用就可以通过域名访问了！

**示例：**
- 前端：https://xmumdorm.com
- 后端：https://api.xmumdorm.com（或 Railway 提供的 URL）

祝部署顺利！🚀

