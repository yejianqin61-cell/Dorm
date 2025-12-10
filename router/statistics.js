const express = require('express');
const router = express.Router();
const statistics_handler = require('../router_handler/statistics_handler.js');

// 获取统计数据（仅管理员）
router.get('/statistics', statistics_handler.getStatistics);

// 记录页面访问（公开接口，不需要认证）
router.post('/statistics/view', statistics_handler.recordPageView);

module.exports = router;

