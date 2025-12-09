const express = require('express');
const router = express.Router();

const expressJoi = require('@escook/express-joi');
const { reg_login_schema, reg_schema } = require('../schemas/schemas_user.js');

const user_handler = require('../router_handler/user_handler.js');

router.post('/reguser', expressJoi(reg_schema), user_handler.regUser);
router.post('/login', expressJoi(reg_login_schema), user_handler.login);

module.exports = router;
