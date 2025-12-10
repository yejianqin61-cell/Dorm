const db = require('../db/index.js');

// 获取统计数据（仅管理员）
exports.getStatistics = (req, res) => {
  const isAdmin = req.user.is_admin || 0;
  
  if (!isAdmin) {
    return res.cc('权限不足，仅管理员可查看统计数据');
  }
  
  // 获取用户总数
  db.query('SELECT COUNT(*) as total FROM ev_users', (err, userCount) => {
    if (err) return res.cc(err);
    
    // 获取帖子总数
    db.query('SELECT COUNT(*) as total FROM ev_posts', (err2, postCount) => {
      if (err2) return res.cc(err2);
      
      // 获取评论总数
      db.query('SELECT COUNT(*) as total FROM ev_post_comments', (err3, commentCount) => {
        if (err3) return res.cc(err3);
        
        // 获取点赞总数
        db.query('SELECT COUNT(*) as total FROM ev_post_likes', (err4, likeCount) => {
          if (err4) return res.cc(err4);
          
          // 获取今日新增用户数
          db.query(
            'SELECT COUNT(*) as total FROM ev_users WHERE DATE(created_at) = CURDATE()',
            (err5, todayUsers) => {
              if (err5) return res.cc(err5);
              
              // 获取今日新增帖子数
              db.query(
                'SELECT COUNT(*) as total FROM ev_posts WHERE DATE(created_at) = CURDATE()',
                (err6, todayPosts) => {
                  if (err6) return res.cc(err6);
                  
                  // 获取总浏览量（去重后的IP数）
                  db.query(
                    'SELECT COUNT(DISTINCT ip_address) as total FROM ev_page_views',
                    (err7, viewCount) => {
                      if (err7) return res.cc(err7);
                      
                      // 获取今日浏览量
                      db.query(
                        'SELECT COUNT(*) as total FROM ev_page_views WHERE DATE(created_at) = CURDATE()',
                        (err8, todayViews) => {
                          if (err8) return res.cc(err8);
                          
                          // 获取最近7天的用户注册趋势
                          db.query(`
                            SELECT DATE(created_at) as date, COUNT(*) as count 
                            FROM ev_users 
                            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                            GROUP BY DATE(created_at)
                            ORDER BY date ASC
                          `, (err9, userTrend) => {
                            if (err9) return res.cc(err9);
                            
                            res.send({
                              status: 0,
                              message: '获取统计数据成功',
                              data: {
                                users: {
                                  total: userCount[0].total,
                                  today: todayUsers[0].total
                                },
                                posts: {
                                  total: postCount[0].total,
                                  today: todayPosts[0].total
                                },
                                comments: {
                                  total: commentCount[0].total
                                },
                                likes: {
                                  total: likeCount[0].total
                                },
                                views: {
                                  total: viewCount[0].total || 0,
                                  today: todayViews[0].total || 0
                                },
                                userTrend: userTrend || []
                              }
                            });
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  });
};

// 记录页面访问
exports.recordPageView = (req, res) => {
  const userId = req.user?.id || null;
  const pagePath = req.body.page_path || req.path || '/';
  const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  const sql = 'INSERT INTO ev_page_views (page_path, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?)';
  db.query(sql, [pagePath, userId, ipAddress, userAgent], (err) => {
    // 静默记录，不返回错误（避免影响用户体验）
    if (err) {
      console.error('Error recording page view:', err.message);
    }
  });
  
  // 立即返回成功，不等待数据库操作完成
  res.send({ status: 0, message: '记录成功' });
};

