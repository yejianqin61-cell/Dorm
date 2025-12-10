// 创建官方账号的脚本
const db = require('./index.js');
const bcrypt = require('bcryptjs');

const createOfficialAccount = () => {
  const studentId = 'XMUMDORM';
  const password = '20061016';
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // 先检查账号是否已存在
  db.query('SELECT id FROM ev_users WHERE student_id = ?', [studentId], (err, results) => {
    if (err) {
      console.error('Error checking official account:', err.message);
      return;
    }
    
    if (results.length > 0) {
      // 账号已存在，更新为管理员
      db.query(
        'UPDATE ev_users SET is_admin = 1, nickname = ? WHERE student_id = ?',
        ['XMUM Dorm Official', studentId],
        (err2, results2) => {
          if (err2) {
            console.error('Error updating official account:', err2.message);
          } else {
            console.log(`Official account ${studentId} updated. Affected rows: ${results2.affectedRows}`);
          }
        }
      );
    } else {
      // 创建新账号
      db.query(
        'INSERT INTO ev_users (student_id, password, nickname, email, is_admin) VALUES (?, ?, ?, ?, ?)',
        [studentId, hashedPassword, 'XMUM Dorm Official', 'official@xmumdorm.com', 1],
        (err2, results2) => {
          if (err2) {
            console.error('Error creating official account:', err2.message);
          } else {
            console.log(`Official account ${studentId} created successfully. ID: ${results2.insertId}`);
          }
        }
      );
    }
  });
};

// 延迟执行，确保数据库连接已建立
setTimeout(createOfficialAccount, 4000);

module.exports = { createOfficialAccount };

