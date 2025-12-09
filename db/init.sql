-- 初始化数据库表
-- 先删除可能存在的表（如果表不存在会报错，但可以忽略）
DROP TABLE IF EXISTS ev_post_comments;
DROP TABLE IF EXISTS ev_post_likes;
DROP TABLE IF EXISTS ev_posts;
DROP TABLE IF EXISTS ev_users;

-- 先创建所有表（不带外键约束）
CREATE TABLE ev_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  email VARCHAR(255),
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ev_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ev_post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_like (post_id, user_id)
);

CREATE TABLE ev_post_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 然后添加外键约束
ALTER TABLE ev_posts ADD FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE;
ALTER TABLE ev_post_likes ADD FOREIGN KEY (post_id) REFERENCES ev_posts(id) ON DELETE CASCADE;
ALTER TABLE ev_post_likes ADD FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE;
ALTER TABLE ev_post_comments ADD FOREIGN KEY (post_id) REFERENCES ev_posts(id) ON DELETE CASCADE;
ALTER TABLE ev_post_comments ADD FOREIGN KEY (user_id) REFERENCES ev_users(id) ON DELETE CASCADE;

