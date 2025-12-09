const joi = require('joi');

const content = joi.string().min(1).max(500).required();
const image_url = joi.string().uri().allow('', null);
const post_id = joi.number().integer().min(1).required();

// 创建动态
exports.create_post_schema = {
  body: {
    content,
    image_url
  }
};

// 点赞/取消点赞
exports.post_id_schema = {
  params: {
    id: post_id
  }
};

// 评论
exports.create_comment_schema = {
  params: {
    id: post_id
  },
  body: {
    content
  }
};

