const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// 初始化数据库表（启动时自动执行）
setTimeout(() => {
  try {
    require('./db/init.js');
    // 延迟执行管理员设置，确保表已创建
    setTimeout(() => {
      try {
        require('./db/set_admin.js');
      } catch (err) {
        console.log('Admin setup skipped or failed:', err.message);
      }
    }, 5000); // 在数据库初始化后5秒执行
  } catch (err) {
    console.log('Database init skipped or failed:', err.message);
  }
}, 2000); // 延迟2秒执行，确保数据库连接已建立

const joi = require('joi');

// res.cc 定义必须放在前面
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    });
  };
  next();
});

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 静态访问上传文件（必须在 JWT 之前，否则会被拦截）
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

const expressJWT = require('express-jwt');
const config = require('./schemas/config.js');

// 路由
const userRouter = require('./router/user.js');
const userinfoRouter = require('./router/userinfo.js');
const postRouter = require('./router/post.js');
const uploadRouter = require('./router/upload.js');

// token 认证，仅放行注册、登录等公开接口
app.use(
  expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({
    path: [
      /^\/api\/reguser$/,
      /^\/api\/login$/,
      /^\/uploads\//  // 排除静态文件路径
    ]
  })
);

// 注册路由
app.use('/api', userRouter);
app.use('/api', userinfoRouter);
app.use('/api', postRouter);
app.use('/api', uploadRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
  res.cc(err);
});

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`api server running at http://0.0.0.0:${PORT}`);
});
