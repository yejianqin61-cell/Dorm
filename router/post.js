const express = require('express');
const router = express.Router();
const expressJoi = require('@escook/express-joi');
const {
  create_post_schema,
  post_id_schema,
  create_comment_schema
} = require('../schemas/schemas_post.js');

const post_handler = require('../router_handler/post_handler.js');

// 创建动态
router.post('/posts', expressJoi(create_post_schema), post_handler.createPost);
// 获取动态列表
router.get('/posts', post_handler.listPosts);
// 获取自己的动态列表
router.get('/posts/mine', post_handler.listMyPosts);
// 删除动态
router.delete('/posts/:id', expressJoi(post_id_schema), post_handler.deletePost);
// 点赞/取消点赞
router.post('/posts/:id/like', expressJoi(post_id_schema), post_handler.toggleLike);
// 发表评论
router.post('/posts/:id/comment', expressJoi(create_comment_schema), post_handler.createComment);
// 获取评论列表
router.get('/posts/:id/comment', expressJoi(post_id_schema), post_handler.listComments);

module.exports = router;

