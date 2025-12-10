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

