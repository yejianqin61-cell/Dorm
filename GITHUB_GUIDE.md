# GitHub 提交代码完整指南（新手版）

## 📋 第一步：安装 Git

### Windows 系统

1. **下载 Git**
   - 访问：https://git-scm.com/download/win
   - 点击下载，会自动下载安装包

2. **安装 Git**
   - 双击下载的 `.exe` 文件
   - 一路点击 "Next"（使用默认设置即可）
   - 最后点击 "Install" 完成安装

3. **验证安装**
   - 按 `Win + R`，输入 `cmd`，回车
   - 在命令行输入：
     ```bash
     git --version
     ```
   - 如果显示版本号（如 `git version 2.xx.x`），说明安装成功

---

## 📋 第二步：注册 GitHub 账号

1. **访问 GitHub**
   - 打开：https://github.com
   - 点击右上角 "Sign up"

2. **填写信息**
   - Username（用户名）：选择一个用户名（如：`yejianqin61`）
   - Email（邮箱）：填写你的邮箱
   - Password（密码）：设置密码（至少8位）
   - 点击 "Create account"

3. **验证邮箱**
   - GitHub 会发验证邮件到你的邮箱
   - 打开邮件，点击验证链接

---

## 📋 第三步：创建 GitHub 仓库

1. **登录 GitHub**
   - 访问：https://github.com
   - 用你的账号登录

2. **创建新仓库**
   - 点击右上角的 **"+"** 号 → **"New repository"**
   - 或者直接访问：https://github.com/new

3. **填写仓库信息**
   - **Repository name**（仓库名）：`Dorm` 或 `XMUM-Dorm`
   - **Description**（描述）：`XMUM Campus Social Platform`（可选）
   - **Public**（公开）或 **Private**（私有）：选 Public（免费）
   - **不要勾选** "Add a README file"（我们已经有了）
   - **不要勾选** "Add .gitignore"（我们已经有了）
   - **不要勾选** "Choose a license"（可选）

4. **创建仓库**
   - 点击绿色的 **"Create repository"** 按钮
   - 创建成功后，GitHub 会显示一个页面，**先不要关闭**，后面要用

---

## 📋 第四步：在本地初始化 Git 并提交代码

### 方法一：使用命令行（推荐）

1. **打开命令行**
   - 在项目文件夹 `XMUM NOOK` 中，按住 `Shift` + 右键
   - 选择 **"在此处打开 PowerShell 窗口"** 或 **"在此处打开命令窗口"**

2. **配置 Git（首次使用需要）**
   ```bash
   git config --global user.name "你的GitHub用户名"
   git config --global user.email "你的GitHub邮箱"
   ```
   例如：
   ```bash
   git config --global user.name "yejianqin61"
   git config --global user.email "your-email@example.com"
   ```

3. **初始化 Git 仓库**
   ```bash
   git init
   ```
   会显示：`Initialized empty Git repository in ...`

4. **添加所有文件**
   ```bash
   git add .
   ```
   （这个 `.` 表示当前目录的所有文件）

5. **提交代码**
   ```bash
   git commit -m "Initial commit - XMUM Dorm 1.0.0"
   ```
   会显示类似：`[main (root-commit) xxxxx] Initial commit...`

6. **连接到 GitHub 仓库**
   - 回到 GitHub 页面，找到你的仓库地址
   - 应该类似：`https://github.com/你的用户名/Dorm.git`
   - 复制这个地址

   然后在命令行输入：
   ```bash
   git remote add origin https://github.com/你的用户名/Dorm.git
   ```
   例如：
   ```bash
   git remote add origin https://github.com/yejianqin61/Dorm.git
   ```

7. **推送到 GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

8. **输入 GitHub 账号密码**
   - 如果提示输入用户名和密码：
     - Username：你的 GitHub 用户名
     - Password：**不是你的 GitHub 密码！**
     - 需要创建 **Personal Access Token**（见下方说明）

---

## 🔐 关于 GitHub 密码（Personal Access Token）

GitHub 不再支持直接用密码推送，需要创建 Token：

### 创建 Token 步骤：

1. **打开 GitHub 设置**
   - 点击右上角头像 → **Settings**
   - 左侧菜单找到 **Developer settings**
   - 点击 **Personal access tokens** → **Tokens (classic)**
   - 点击 **Generate new token** → **Generate new token (classic)**

2. **设置 Token**
   - **Note**（备注）：`Dorm Project`
   - **Expiration**（有效期）：选 `90 days` 或 `No expiration`
   - **勾选权限**：至少勾选 `repo`（全部权限）
   - 滚动到底部，点击 **Generate token**

3. **复制 Token**
   - **重要**：Token 只显示一次，立即复制保存！
   - 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxx`

4. **使用 Token**
   - 推送时，密码输入框输入这个 Token（不是 GitHub 密码）

---

## 📋 方法二：使用 GitHub Desktop（图形界面，更简单）

如果你觉得命令行太复杂，可以用图形界面工具：

1. **下载 GitHub Desktop**
   - 访问：https://desktop.github.com
   - 下载并安装

2. **登录 GitHub Desktop**
   - 打开 GitHub Desktop
   - 用你的 GitHub 账号登录

3. **添加本地仓库**
   - 点击 **File** → **Add Local Repository**
   - 选择你的项目文件夹 `XMUM NOOK`
   - 点击 **Add repository**

4. **提交代码**
   - 在左侧会看到所有修改的文件
   - 在左下角输入提交信息：`Initial commit - XMUM Dorm 1.0.0`
   - 点击 **Commit to main**

5. **推送到 GitHub**
   - 点击右上角 **Publish repository**
   - 输入仓库名：`Dorm`
   - 选择 **Public**
   - 点击 **Publish repository**

---

## ✅ 验证是否成功

推送成功后：

1. **刷新 GitHub 页面**
   - 访问：https://github.com/你的用户名/Dorm
   - 应该能看到所有文件了

2. **检查文件**
   - 确认能看到 `app.js`、`package.json`、`html/` 等文件夹
   - 确认能看到 `.gitignore`、`README.md`、`DEPLOY.md` 等文件

---

## 🔄 以后如何更新代码

每次修改代码后，推送更新的步骤：

### 命令行方式：
```bash
git add .
git commit -m "描述你的修改内容"
git push
```

### GitHub Desktop 方式：
1. 打开 GitHub Desktop
2. 左侧会显示修改的文件
3. 输入提交信息
4. 点击 **Commit to main**
5. 点击 **Push origin**

---

## ❓ 常见问题

### Q: 提示 "fatal: not a git repository"
**A:** 你不在项目目录里，或者还没执行 `git init`。确保在 `XMUM NOOK` 文件夹里执行命令。

### Q: 提示 "remote origin already exists"
**A:** 说明已经连接过 GitHub 了，直接执行 `git push` 即可。

### Q: 推送时提示 "Authentication failed"
**A:** 
- 检查用户名是否正确
- 密码要用 Personal Access Token，不是 GitHub 密码
- Token 可能过期了，重新生成一个

### Q: 想删除敏感信息（如数据库密码）
**A:** 
- 如果已经提交了包含密码的文件，需要：
  1. 修改文件，移除密码
  2. 提交修改
  3. 考虑使用 `.gitignore` 排除敏感文件（我们已经有了）

### Q: 推送时很慢
**A:** 
- 正常，第一次推送文件较多
- 如果一直卡住，检查网络连接

---

## 🎉 完成！

代码提交成功后，就可以按照 `DEPLOY.md` 的步骤部署了！

**下一步：**
1. ✅ 代码已提交到 GitHub
2. ➡️ 去 Railway 部署后端（见 `DEPLOY.md`）

---

## 📞 需要帮助？

如果遇到问题：
1. 检查错误信息，Google 搜索错误信息
2. 确认每一步都按顺序执行
3. 截图错误信息，我可以帮你排查

祝顺利！🚀

