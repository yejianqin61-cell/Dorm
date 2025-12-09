const joi = require('joi');

const student_id = joi.string().alphanum().min(4).max(16).required();
const password = joi.string().pattern(/^[\S]{6,16}$/).required();


//定义id, nickname, email, picture的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().min(1).max(30).required();
const email = joi.string().email().required();

//定义avatar的验证规则（允许 http/https 链接或 data URI）
const picture = joi.alternatives().try(
  joi.string().dataUri(),
  joi.string().uri()
).required();


// 注册 schema（包含邮箱）
exports.reg_schema = {
  body: {
    student_id,
    password,
    email
  },
};

// 登录 schema
exports.reg_login_schema = {
  body: {
    student_id,
    password,
  },
};

//验证规则对象 - 获取用户信息
exports.get_userinfo_schema = {
  body: {
    id,
    nickname,
    email,

  },
};

const oldPwd = joi.string().pattern(/^[\S]{6,16}$/).required();
const newPwd = joi.string().pattern(/^[\S]{6,16}$/).required();

//验证规则对象 - 更新密码
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
};
// 验证规则对象 - 更新用户信息
exports.update_userInfo_schema = {
  body: {
    nickname,
    email,
  },
};

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
  body: {
    avatar: picture,
  },
};  
