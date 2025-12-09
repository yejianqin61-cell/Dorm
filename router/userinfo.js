const express = require('express');
const router = express.Router();
//引入用户信息处理函数模块
const userinfo_handler = require('../router_handler/userinfo_handler.js');

//引入验证中间件
const expressJoi = require('@escook/express-joi');
const { update_userInfo_schema, update_password_schema, update_avatar_schema } = require('../schemas/schemas_user.js');


//获取用户信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo);
//更新用户信息的路由
router.post('/userinfo', expressJoi(update_userInfo_schema), userinfo_handler.updateUserInfo);


//更新密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword);

//更换头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar);



module.exports = router;


