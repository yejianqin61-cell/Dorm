# XMUM Dorm API 接口文档

## 基础信息

- **Base URL**: `https://dorm-production.up.railway.app/api` (生产环境)
- **Base URL**: `http://127.0.0.1:4040/api` (本地开发)
- **认证方式**: JWT Token (Bearer Token)
- **响应格式**: JSON

---

## 一、用户认证接口 (无需Token)

### 1. 用户注册
- **接口**: `POST /api/reguser`
- **认证**: ❌ 无需认证
- **请求体**:
```json
{
  "student_id": "CST2509054",
  "email": "user@example.com",
  "password": "your_password"
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "注册成功！",
  "data": {
    "student_id": "CST2509054"
  }
}
```

### 2. 用户登录
- **接口**: `POST /api/login`
- **认证**: ❌ 无需认证
- **请求体**:
```json
{
  "student_id": "CST2509054",
  "password": "your_password"
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "登录成功！",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "student_id": "CST2509054",
    "email": "user@example.com",
    "nickname": "CST2509054",
    "picture": null
  }
}
```

---

## 二、用户信息接口 (需要Token)

### 3. 获取用户信息
- **接口**: `GET /api/userinfo`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "status": 0,
  "message": "获取用户信息成功！",
  "data": {
    "id": 1,
    "student_id": "CST2509054",
    "nickname": "用户昵称",
    "email": "user@example.com",
    "picture": "/uploads/avatar.jpg"
  }
}
```

### 4. 更新用户信息
- **接口**: `POST /api/userinfo`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "nickname": "新昵称",
  "email": "newemail@example.com"
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "更新用户信息成功！"
}
```

### 5. 更新密码
- **接口**: `POST /api/updatepwd`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "oldPwd": "旧密码",
  "newPwd": "新密码"
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "更新密码成功！"
}
```

### 6. 更新头像
- **接口**: `POST /api/update/avatar`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "avatar": "/uploads/avatar.jpg"
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "更新头像成功！"
}
```

---

## 三、帖子接口 (需要Token)

### 7. 创建帖子
- **接口**: `POST /api/posts`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "content": "帖子内容",
  "image_url": "/uploads/image.jpg"  // 可选
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "发布成功"
}
```

### 8. 获取帖子列表
- **接口**: `GET /api/posts`
- **认证**: ⚠️ 可选（未登录也能查看，但某些功能受限）
- **请求头**: `Authorization: Bearer <token>` (可选)
- **查询参数**:
  - `limit`: 每页数量 (默认: 20)
  - `offset`: 偏移量 (默认: 0)
- **示例**: `GET /api/posts?limit=10&offset=0`
- **响应**:
```json
{
  "status": 0,
  "message": "获取动态成功",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "content": "帖子内容",
      "image_url": "/uploads/image.jpg",
      "created_at": "2025-12-10T10:00:00.000Z",
      "nickname": "用户昵称",
      "student_id": "CST2509054",
      "user_picture": "/uploads/avatar.jpg",
      "like_count": 5,
      "comment_count": 3
    }
  ]
}
```

### 9. 获取我的帖子列表
- **接口**: `GET /api/posts/mine`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **响应**: 同帖子列表格式

### 10. 删除帖子
- **接口**: `DELETE /api/posts/:id`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **路径参数**: `id` - 帖子ID
- **权限**: 只能删除自己的帖子
- **响应**:
```json
{
  "status": 0,
  "message": "删除成功"
}
```

### 11. 点赞/取消点赞
- **接口**: `POST /api/posts/:id/like`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **路径参数**: `id` - 帖子ID
- **响应**:
```json
{
  "status": 0,
  "message": "点赞成功" | "已取消点赞",
  "data": {
    "like_count": 6,
    "liked": true
  }
}
```

### 12. 发表评论
- **接口**: `POST /api/posts/:id/comment`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **路径参数**: `id` - 帖子ID
- **请求体**:
```json
{
  "content": "评论内容"
}
```
- **响应**:
```json
{
  "status": 0,
  "message": "评论成功"
}
```

### 13. 获取评论列表
- **接口**: `GET /api/posts/:id/comment`
- **认证**: ⚠️ 可选（未登录也能查看）
- **请求头**: `Authorization: Bearer <token>` (可选)
- **路径参数**: `id` - 帖子ID
- **响应**:
```json
{
  "status": 0,
  "message": "获取评论成功",
  "data": [
    {
      "id": 1,
      "content": "评论内容",
      "created_at": "2025-12-10T10:00:00.000Z",
      "nickname": "用户昵称",
      "user_picture": "/uploads/avatar.jpg"
    }
  ]
}
```

---

## 四、文件上传接口 (需要Token)

### 14. 上传文件
- **接口**: `POST /api/upload`
- **认证**: ✅ 需要Token
- **请求头**: `Authorization: Bearer <token>`
- **请求类型**: `multipart/form-data`
- **请求体**: 
  - `file`: 文件 (FormData)
- **响应**:
```json
{
  "status": 0,
  "message": "上传成功",
  "data": {
    "url": "/uploads/1234567890-123456.jpg"
  }
}
```

---

## 五、静态资源接口 (无需Token)

### 15. 访问上传的文件
- **接口**: `GET /uploads/:filename`
- **认证**: ❌ 无需认证
- **说明**: 直接访问上传的文件，如 `/uploads/1234567890-123456.jpg`

---

## 错误响应格式

所有接口在出错时返回：
```json
{
  "status": 1,
  "message": "错误信息"
}
```

常见错误：
- `status: 1, message: "身份认证失败！"` - Token无效或过期
- `status: 1, message: "学号或邮箱已被注册，请更换！"` - 注册时学号或邮箱重复
- `status: 1, message: "登录失败，用户不存在！"` - 登录时用户不存在
- `status: 1, message: "登录失败，密码错误！"` - 密码错误
- `status: 1, message: "只能删除自己的帖子"` - 无权限删除他人帖子

---

## 接口汇总表

| 序号 | 方法 | 路径 | 功能 | 需要Token |
|------|------|------|------|-----------|
| 1 | POST | `/api/reguser` | 用户注册 | ❌ |
| 2 | POST | `/api/login` | 用户登录 | ❌ |
| 3 | GET | `/api/userinfo` | 获取用户信息 | ✅ |
| 4 | POST | `/api/userinfo` | 更新用户信息 | ✅ |
| 5 | POST | `/api/updatepwd` | 更新密码 | ✅ |
| 6 | POST | `/api/update/avatar` | 更新头像 | ✅ |
| 7 | POST | `/api/posts` | 创建帖子 | ✅ |
| 8 | GET | `/api/posts` | 获取帖子列表 | ⚠️ |
| 9 | GET | `/api/posts/mine` | 获取我的帖子 | ✅ |
| 10 | DELETE | `/api/posts/:id` | 删除帖子 | ✅ |
| 11 | POST | `/api/posts/:id/like` | 点赞/取消点赞 | ✅ |
| 12 | POST | `/api/posts/:id/comment` | 发表评论 | ✅ |
| 13 | GET | `/api/posts/:id/comment` | 获取评论列表 | ⚠️ |
| 14 | POST | `/api/upload` | 上传文件 | ✅ |
| 15 | GET | `/uploads/:filename` | 访问上传文件 | ❌ |

**图例**:
- ✅ = 必须提供Token
- ❌ = 不需要Token
- ⚠️ = 可选（未登录可查看，但功能受限）

---

## 使用示例

### JavaScript Fetch 示例

```javascript
// 登录
const loginResponse = await fetch('https://dorm-production.up.railway.app/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 'CST2509054',
    password: 'your_password'
  })
});
const loginData = await loginResponse.json();
const token = loginData.token; // "Bearer ..."

// 获取用户信息
const userInfoResponse = await fetch('https://dorm-production.up.railway.app/api/userinfo', {
  headers: { 'Authorization': token }
});
const userInfo = await userInfoResponse.json();

// 创建帖子
const postResponse = await fetch('https://dorm-production.up.railway.app/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  },
  body: JSON.stringify({
    content: '这是我的第一条帖子',
    image_url: '/uploads/image.jpg'
  })
});

// 上传文件
const formData = new FormData();
formData.append('file', fileInput.files[0]);
const uploadResponse = await fetch('https://dorm-production.up.railway.app/api/upload', {
  method: 'POST',
  headers: { 'Authorization': token },
  body: formData
});
```

---

**文档生成时间**: 2025-12-10
**API版本**: v1.0




