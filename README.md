# XMUM Dorm 厦马小筑

校园社交平台 - 1.0.0 版本
当前1.0.0版本后端服务已弃用，请转至www.xmumdorm.com使用2.0.0版本

## 📋 功能

- ✅ 用户注册/登录（学号+邮箱）
- ✅ 修改个人信息（昵称、邮箱、头像）
- ✅ 发布动态（文字+图片）
- ✅ 点赞动态
- ✅ 评论动态
- ✅ 查看自己的所有动态
- ✅ 删除自己的动态

## 🚀 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置数据库**
   - 创建 MySQL 数据库 `my_db`
   - 执行建表 SQL（见 `DEPLOY.md`）

3. **配置环境变量**（可选）
   - 创建 `.env` 文件（参考 `.env.example`）
   - 或直接使用代码中的默认值

4. **启动后端**
   ```bash
   npm start
   ```
   后端运行在 `http://127.0.0.1:4040`

5. **打开前端**
   - 用浏览器打开 `html/main page.html`
   - 或使用本地服务器（如 VS Code Live Server）

## 📦 项目结构

```
Dorm/
├── app.js                 # Express 主文件
├── package.json          # 依赖配置
├── db/                   # 数据库配置
│   └── index.js
├── router/               # 路由定义
│   ├── user.js          # 用户相关路由
│   ├── userinfo.js      # 用户信息路由
│   ├── post.js          # 动态相关路由
│   └── upload.js        # 文件上传路由
├── router_handler/      # 路由处理函数
│   ├── user_handler.js
│   ├── userinfo_handler.js
│   └── post_handler.js
├── schemas/             # 数据验证规则
│   ├── config.js        # JWT 配置
│   ├── schemas_user.js
│   └── schemas_post.js
├── html/                # 前端文件
│   ├── main page.html   # 主页
│   ├── log in.html      # 登录页
│   ├── register.html    # 注册页
│   ├── myprofile.html   # 个人资料页
│   ├── create_post.html # 发布动态页
│   ├── config.js        # 前端 API 配置
│   ├── auth.js          # 认证管理
│   └── main_page_script.js
└── uploads/             # 上传文件目录
```

## 🌐 部署

详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)

**推荐方案：**
- 前端：Vercel
- 后端：Railway.app
- 数据库：Railway MySQL 或 PlanetScale
- 域名：Namecheap / Cloudflare

## 🔐 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DB_HOST` | 数据库主机 | `127.0.0.1` |
| `DB_USER` | 数据库用户 | `root` |
| `DB_PASSWORD` | 数据库密码 | - |
| `DB_NAME` | 数据库名 | `my_db` |
| `JWT_SECRET` | JWT 密钥 | - |
| `JWT_EXPIRES_IN` | Token 有效期 | `10h` |
| `PORT` | 服务器端口 | `4040` |

## 📝 API 接口

### 用户相关
- `POST /api/reguser` - 注册
- `POST /api/login` - 登录
- `GET /api/userinfo` - 获取用户信息
- `POST /api/userinfo` - 更新用户信息
- `POST /api/update/avatar` - 更新头像

### 动态相关
- `GET /api/posts` - 获取动态列表
- `GET /api/posts/mine` - 获取我的动态
- `POST /api/posts` - 发布动态
- `DELETE /api/posts/:id` - 删除动态
- `POST /api/posts/:id/like` - 点赞/取消点赞
- `POST /api/posts/:id/comment` - 发表评论
- `GET /api/posts/:id/comment` - 获取评论列表

### 文件上传
- `POST /api/upload` - 上传图片

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **数据库**: MySQL
- **认证**: JWT
- **文件上传**: Multer
- **前端**: 原生 HTML/CSS/JavaScript

## 📄 License

ISC

## 👤 作者

yjq

---

**XMUM Dorm - 为 XMUMers 打造的校园社区** 🎓

