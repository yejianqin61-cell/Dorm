-- 初始化数据库表
-- 如果表已存在，会报错但不会影响运行

-- 先创建用户表（没有外键依赖）
CREATE TABLE IF NOT EXISTS ev_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  email VARCHAR(255),
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 再创建帖子表（依赖用户表）
CREATE TABLE IF NOT EXISTS ev_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE
);

-- 最后创建点赞和评论表（依赖帖子表和用户表）
CREATE TABLE IF NOT EXISTS ev_post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES ev_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ev_post_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES ev_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE
);

