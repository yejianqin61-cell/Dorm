-- 初始化数据库表（简化版，不带外键约束）
-- 外键约束不是必需的，应用层会保证数据完整性

CREATE TABLE IF NOT EXISTS ev_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  email VARCHAR(255),
  picture VARCHAR(500),
  is_admin TINYINT(1) DEFAULT 0 COMMENT '是否为管理员，1=是，0=否',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ev_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  is_official TINYINT(1) DEFAULT 0 COMMENT '是否为官方帖子，1=是，0=否',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ev_post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_like (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS ev_post_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为现有表添加 is_admin 字段（如果不存在，会报错但可以忽略）
-- 注意：如果字段已存在，ALTER TABLE 会报错，但不会影响其他操作

-- 为 ev_posts 表添加 is_official 字段
-- 注意：如果字段已存在，ALTER TABLE 会报错，但可以忽略

-- 创建通知表
CREATE TABLE IF NOT EXISTS ev_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT COMMENT 'NULL表示所有用户，具体ID表示特定用户',
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0 COMMENT '是否已读，1=已读，0=未读',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户已读通知记录表（用于弹窗通知）
CREATE TABLE IF NOT EXISTS ev_user_read_notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  notice_id INT NOT NULL COMMENT '通知ID，如果是官方帖子弹窗，则为帖子ID',
  notice_type VARCHAR(50) DEFAULT 'notification' COMMENT '通知类型：notification=普通通知，post_popup=帖子弹窗',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_notice (user_id, notice_id, notice_type)
);

-- 创建访问统计表（记录页面浏览量）
CREATE TABLE IF NOT EXISTS ev_page_views (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_path VARCHAR(200) NOT NULL COMMENT '页面路径',
  user_id INT COMMENT '用户ID，NULL表示未登录用户',
  ip_address VARCHAR(50) COMMENT 'IP地址',
  user_agent TEXT COMMENT '用户代理',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page_path (page_path),
  INDEX idx_created_at (created_at)
);

