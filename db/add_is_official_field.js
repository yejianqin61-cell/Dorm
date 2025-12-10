// 为 ev_posts 表添加 is_official 字段的脚本
const db = require('./index.js');

const addIsOfficialField = () => {
  // 先尝试添加 is_official 字段
  db.query(`
    ALTER TABLE ev_posts 
    ADD COLUMN is_official TINYINT(1) DEFAULT 0 COMMENT '是否为官方帖子，1=是，0=否'
  `, (err) => {
    // 如果字段已存在，会报错，但可以忽略
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
      console.error('Error adding is_official column:', err.message);
    } else {
      console.log('is_official column added or already exists');
      
      // 为现有帖子设置默认值（确保所有旧帖子都是非官方）
      db.query(
        'UPDATE ev_posts SET is_official = 0 WHERE is_official IS NULL',
        (err2, results) => {
          if (err2) {
            console.error('Error updating existing posts:', err2.message);
          } else {
            console.log(`Updated ${results.affectedRows} existing posts with is_official = 0`);
          }
        }
      );
    }
  });
};

// 延迟执行，确保数据库连接已建立
setTimeout(addIsOfficialField, 4000);

module.exports = { addIsOfficialField };

