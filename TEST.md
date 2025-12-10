# 测试步骤

## 1. 确认 Railway 后端 URL

1. 打开 Railway Dashboard: https://railway.app
2. 点击你的后端服务
3. 在 "Settings" → "Networking" 中查看你的 URL
4. 应该是类似：`https://xxx.up.railway.app`

## 2. 测试后端是否正常

在浏览器中访问：
```
https://你的后端URL/api/posts
```

应该返回 JSON 数据（可能是空数组 `{"status":0,"data":[]}`）

## 3. 测试前端

1. 打开你的 Vercel 前端 URL
2. 按 F12 打开浏览器开发者工具
3. 切换到 "Console" 标签
4. 输入：`window.API_BASE_URL`
5. 查看显示的 URL 是否正确（应该是你的 Railway 后端 URL）

## 4. 测试登录

1. 在前端页面点击 "Login"
2. 使用测试账号：
   - Student ID: `CST1234567`
   - Password: `123456`
3. 查看浏览器控制台（F12 → Console）是否有错误
4. 查看 Network 标签，找到 `/api/login` 请求：
   - 查看 Request Headers，确认 URL 正确
   - 查看 Response，确认返回了 `token`

## 5. 如果登录成功但后续请求失败

1. 在浏览器控制台输入：
   ```javascript
   localStorage.getItem('userToken')
   ```
2. 应该能看到一个 JWT token 字符串
3. 如果 token 存在，检查后续请求的 Authorization header：
   - 在 Network 标签中找到失败的请求
   - 查看 Request Headers
   - Authorization 应该是：`Bearer <token>`

## 6. 常见问题

### 问题：CORS 错误
- 检查后端 `app.js` 中是否有 `app.use(cors())`

### 问题：401 身份认证失败
- 检查 Authorization header 格式：应该是 `Bearer <token>`，不是只有 `<token>`
- 检查 token 是否保存在 localStorage
- 检查后端 JWT_SECRET 是否正确配置

### 问题：404 Not Found
- 检查 API_BASE_URL 是否正确
- 检查后端路由是否正确（应该是 `/api/xxx`）


