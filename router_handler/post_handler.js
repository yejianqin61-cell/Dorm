const db = require('../db/index.js');

// 创建动态
exports.createPost = (req, res) => {
  const { content, image_url, is_official } = req.body;
  const userId = req.user.id;
  const userStudentId = req.user.student_id;
  
  // 检查是否为官方账号（XMUMDORM）
  const isOfficialAccount = userStudentId === 'XMUMDORM';
  const officialFlag = is_official || (isOfficialAccount ? 1 : 0);
  
  // 先尝试使用 is_official 字段
  let sql = 'insert into ev_posts (user_id, content, image_url, is_official) values (?, ?, ?, ?)';
  db.query(sql, [userId, content, image_url || null, officialFlag], (err, results) => {
    if (err) {
      // 如果失败，可能是 is_official 字段不存在，尝试不使用该字段
      if (err.code === 'ER_BAD_FIELD_ERROR' && err.message.includes('is_official')) {
        console.log('is_official field does not exist, using fallback query');
        sql = 'insert into ev_posts (user_id, content, image_url) values (?, ?, ?)';
        return db.query(sql, [userId, content, image_url || null], (err2, results2) => {
          if (err2) return res.cc(err2);
          if (results2.affectedRows !== 1) return res.cc('发布失败，请稍后重试');
          res.send({ status: 0, message: '发布成功' });
        });
      }
      return res.cc(err);
    }
    if (results.affectedRows !== 1) return res.cc('发布失败，请稍后重试');
    res.send({ status: 0, message: '发布成功' });
  });
};

// 获取动态列表（排除官方帖子）
exports.listPosts = (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;

  // 先检查 is_official 字段是否存在，如果不存在则使用兼容查询
  const sql = `
    SELECT
      p.id,
      p.user_id,
      p.content,
      p.image_url,
      p.created_at,
      u.nickname,
      u.student_id,
      u.picture AS user_picture,
      (SELECT COUNT(*) FROM ev_post_likes l WHERE l.post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM ev_post_comments c WHERE c.post_id = p.id) AS comment_count
    FROM ev_posts p
    LEFT JOIN ev_users u ON p.user_id = u.id
    WHERE (p.is_official = 0 OR p.is_official IS NULL)
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?;
  `;

  db.query(sql, [pageSize, offset], (err, posts) => {
    if (err) {
      // 如果查询失败，可能是字段不存在，尝试不使用 is_official 的查询
      console.error('Error in listPosts, trying fallback query:', err.message);
      const fallbackSql = `
        SELECT
          p.id,
          p.user_id,
          p.content,
          p.image_url,
          p.created_at,
          u.nickname,
          u.student_id,
          u.picture AS user_picture,
          (SELECT COUNT(*) FROM ev_post_likes l WHERE l.post_id = p.id) AS like_count,
          (SELECT COUNT(*) FROM ev_post_comments c WHERE c.post_id = p.id) AS comment_count
        FROM ev_posts p
        LEFT JOIN ev_users u ON p.user_id = u.id
        WHERE u.student_id != 'XMUMDORM' OR u.student_id IS NULL
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?;
      `;
      return db.query(fallbackSql, [pageSize, offset], (err2, posts2) => {
        if (err2) return res.cc(err2);
        res.send({
          status: 0,
          message: '获取动态成功',
          data: posts2
        });
      });
    }
    res.send({
      status: 0,
      message: '获取动态成功',
      data: posts
    });
  });
};

// 获取我的动态列表
exports.listMyPosts = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT
      p.id,
      p.user_id,
      p.content,
      p.image_url,
      p.created_at,
      u.nickname,
      u.student_id,
      u.picture AS user_picture,
      (SELECT COUNT(*) FROM ev_post_likes l WHERE l.post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM ev_post_comments c WHERE c.post_id = p.id) AS comment_count
    FROM ev_posts p
    LEFT JOIN ev_users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC;
  `;
  db.query(sql, [userId], (err, posts) => {
    if (err) return res.cc(err);
    res.send({ status: 0, message: '获取我的动态成功', data: posts });
  });
};

// 删除动态（作者或管理员）
exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.is_admin || 0; // 从 token 中获取管理员标识

  const checkSql = 'select user_id from ev_posts where id=?';
  db.query(checkSql, [postId], (err, rows) => {
    if (err) return res.cc(err);
    if (!rows.length) return res.cc('帖子不存在');
    
    // 检查权限：必须是作者或者是管理员
    if (rows[0].user_id !== userId && !isAdmin) {
      return res.cc('只能删除自己的帖子');
    }

    const delLikes = 'delete from ev_post_likes where post_id=?';
    const delComments = 'delete from ev_post_comments where post_id=?';
    const delPost = 'delete from ev_posts where id=?';

    db.query(delLikes, [postId], (e1) => {
      if (e1) return res.cc(e1);
      db.query(delComments, [postId], (e2) => {
        if (e2) return res.cc(e2);
        db.query(delPost, [postId], (e3, result) => {
          if (e3) return res.cc(e3);
          if (result.affectedRows !== 1) return res.cc('删除失败');
          res.send({ 
            status: 0, 
            message: isAdmin ? '删除成功（管理员操作）' : '删除成功' 
          });
        });
      });
    });
  });
};

// 点赞/取消点赞（切换）
exports.toggleLike = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const checkSql = 'select id from ev_post_likes where post_id=? and user_id=?';
  db.query(checkSql, [postId, userId], (err, results) => {
    if (err) return res.cc(err);

    const hasLiked = results.length > 0;
    const sql = hasLiked
      ? 'delete from ev_post_likes where post_id=? and user_id=?'
      : 'insert into ev_post_likes (post_id, user_id) values (?, ?)';

    db.query(sql, [postId, userId], (err2) => {
      if (err2) return res.cc(err2);

      const countSql = 'select count(*) as cnt from ev_post_likes where post_id=?';
      db.query(countSql, [postId], (err3, countRows) => {
        if (err3) return res.cc(err3);
        res.send({
          status: 0,
          message: hasLiked ? '已取消点赞' : '点赞成功',
          data: {
            like_count: countRows[0].cnt,
            liked: !hasLiked
          }
        });
      });
    });
  });
};

// 发表评论
exports.createComment = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  const sql = 'insert into ev_post_comments (post_id, user_id, content) values (?, ?, ?)';
  db.query(sql, [postId, userId, content], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('评论失败，请稍后重试');

    res.send({
      status: 0,
      message: '评论成功'
    });
  });
};

// 获取单条动态的评论列表（简化版）
exports.listComments = (req, res) => {
  const postId = req.params.id;
  const sql = `
    SELECT
      c.id,
      c.content,
      c.created_at,
      u.nickname,
      u.picture AS user_picture
    FROM ev_post_comments c
    LEFT JOIN ev_users u ON c.user_id = u.id
    WHERE c.post_id=?
    ORDER BY c.created_at DESC
    LIMIT 50;
  `;
  db.query(sql, [postId], (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取评论成功',
      data: results
    });
  });
};

// 获取官方通知帖子（用于弹窗显示）
exports.getOfficialNotices = (req, res) => {
  const userId = req.user.id;
  
  // 获取所有官方帖子
  const sql = `
    SELECT
      p.id,
      p.user_id,
      p.content,
      p.image_url,
      p.created_at,
      u.nickname,
      u.student_id,
      u.picture AS user_picture
    FROM ev_posts p
    LEFT JOIN ev_users u ON p.user_id = u.id
    WHERE p.is_official = 1
    ORDER BY p.created_at DESC
    LIMIT 10;
  `;
  
  db.query(sql, (err, posts) => {
    if (err) return res.cc(err);
    
    // 如果没有官方帖子，直接返回空数组
    if (posts.length === 0) {
      return res.send({ status: 0, message: '获取官方通知成功', data: [] });
    }
    
    // 检查用户已读的官方帖子
    const postIds = posts.map(p => p.id);
    if (postIds.length === 0) {
      return res.send({ status: 0, message: '获取官方通知成功', data: posts });
    }
    
    const placeholders = postIds.map(() => '?').join(',');
    
    db.query(
      `SELECT notice_id FROM ev_user_read_notices WHERE user_id = ? AND notice_id IN (${placeholders}) AND notice_type = 'post_popup'`,
      [userId, ...postIds],
      (err2, readPosts) => {
        if (err2) return res.cc(err2);
        
        const readPostIds = new Set(readPosts.map(r => r.notice_id));
        // 过滤掉已读的帖子
        const unreadPosts = posts.filter(p => !readPostIds.has(p.id));
        
        res.send({
          status: 0,
          message: '获取官方通知成功',
          data: unreadPosts
        });
      }
    );
  });
};

// 标记官方帖子为已读
exports.markOfficialNoticeRead = (req, res) => {
  const userId = req.user.id;
  const { post_id } = req.body;
  
  if (!post_id) return res.cc('缺少帖子ID');
  
  const sql = 'INSERT INTO ev_user_read_notices (user_id, notice_id, notice_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP';
  db.query(sql, [userId, post_id, 'post_popup'], (err, results) => {
    if (err) return res.cc(err);
    res.send({ status: 0, message: '标记已读成功' });
  });
};

