# Cloudinary 图片存储配置指南

## 📋 为什么使用 Cloudinary？

Railway 的文件系统是**临时的**，服务重启后上传的图片会丢失。Cloudinary 提供：
- ✅ 永久存储（不会丢失）
- ✅ 免费额度充足（25GB 存储，25GB 月流量）
- ✅ 自动图片优化和 CDN 加速
- ✅ 图片压缩和格式转换

---

## 🚀 第一步：注册 Cloudinary 账号

1. 访问 https://cloudinary.com
2. 点击右上角 **"Sign Up"** 注册（免费）
3. 使用 GitHub 账号快速注册，或填写邮箱注册

---

## 🔑 第二步：获取 API 密钥

注册成功后：

1. 登录 Cloudinary Dashboard：https://console.cloudinary.com
2. 在 Dashboard 首页，你会看到：
   ```
   Cloud name: xxxxxx
   API Key: 123456789012345
   API Secret: xxxxxxxxxxxxxx
   ```
3. **复制这三个值**，稍后在 Railway 配置中需要用到

⚠️ **注意**：API Secret 只显示一次，请妥善保存！

---

## ⚙️ 第三步：在 Railway 配置环境变量

1. **登录 Railway Dashboard**：https://railway.app/dashboard
2. **找到你的 Dorm 后端服务**
3. **点击服务 → "Variables" 标签**
4. **添加以下三个环境变量**：

   ```
   CLOUDINARY_CLOUD_NAME=你的 cloud name
   CLOUDINARY_API_KEY=你的 API key
   CLOUDINARY_API_SECRET=你的 API secret
   ```

   例如：
   ```
   CLOUDINARY_CLOUD_NAME=dxample123
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   ```

5. **保存后，Railway 会自动重新部署**

---

## 📦 第四步：安装依赖

如果你的代码已经更新了 `package.json`，Railway 会在部署时自动安装。

如果要本地测试，在项目目录运行：

```bash
npm install
```

这会安装：
- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - Multer 的 Cloudinary 存储适配器

---

## ✅ 第五步：测试

1. **等待 Railway 部署完成**（约 1-2 分钟）
2. **访问你的前端网站**
3. **尝试上传一张图片**（发帖或更新头像）
4. **检查图片是否正常显示**

如果图片能正常显示，说明配置成功！🎉

---

## 🐛 常见问题

### Q1: 上传图片后显示 404
**A**: 检查 Railway 环境变量是否正确配置，特别是：
- `CLOUDINARY_CLOUD_NAME` 是否正确
- `CLOUDINARY_API_KEY` 是否正确
- `CLOUDINARY_API_SECRET` 是否正确

### Q2: 部署时报错 "Cannot find module 'cloudinary'"
**A**: 确保 `package.json` 中已添加依赖，并且已提交到 Git。

### Q3: 图片上传失败
**A**: 
1. 检查 Railway 日志，查看具体错误信息
2. 确认 Cloudinary API 密钥有效
3. 检查图片格式是否支持（支持 jpg, jpeg, png, gif, webp）

---

## 📝 注意事项

1. **免费额度**：Cloudinary 免费版有：
   - 25GB 存储空间
   - 25GB 月流量
   - 每月 25,000 次转换
   - 对于小型项目完全够用

2. **图片格式**：自动支持 jpg, jpeg, png, gif, webp

3. **图片优化**：上传的图片会自动：
   - 限制最大尺寸为 1920x1920
   - 压缩以节省空间
   - 通过 CDN 加速访问

4. **文件夹结构**：所有图片会存储在 Cloudinary 的 `dorm` 文件夹中，便于管理

---

## 🔄 迁移说明

- ✅ **新上传的图片**：会直接存储到 Cloudinary
- ❌ **旧图片**：无法恢复（因为 Railway 文件系统是临时的）
- 💡 **建议**：如果旧图片很重要，需要用户重新上传

---

配置完成后，你的图片就再也不会丢失了！🎊

