// 设置管理员权限的脚本
// 在数据库初始化后运行，为指定用户设置管理员权限
const db = require('./index.js');

// 设置 CST2509054 为管理员
const setAdmin = () => {
  const studentId = 'CST2509054';
  
  // 先尝试添加 is_admin 字段（如果不存在）
  db.query(`
    ALTER TABLE ev_users 
    ADD COLUMN is_admin TINYINT(1) DEFAULT 0 COMMENT '是否为管理员，1=是，0=否'
  `, (err) => {
    // 如果字段已存在，会报错，但可以忽略
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
      console.error('Error adding is_admin column:', err.message);
    } else {
      console.log('is_admin column added or already exists');
    }
    
    // 设置指定用户为管理员
    db.query(
      'UPDATE ev_users SET is_admin = 1 WHERE student_id = ?',
      [studentId],
      (err2, results) => {
        if (err2) {
          console.error('Error setting admin:', err2.message);
        } else {
          console.log(`Admin status updated for ${studentId}. Affected rows: ${results.affectedRows}`);
        }
      }
    );
  });
};

// 延迟执行，确保数据库连接已建立
setTimeout(setAdmin, 3000);

module.exports = { setAdmin };

