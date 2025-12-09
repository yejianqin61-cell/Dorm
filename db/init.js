// 数据库初始化脚本
const db = require('./index.js');
const fs = require('fs');
const path = require('path');

// 读取 SQL 文件
const sqlFile = path.join(__dirname, 'init.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// 分割 SQL 语句（按分号分割，过滤空语句和注释）
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => {
    // 过滤空语句和纯注释行
    if (s.length === 0) return false;
    // 移除行内注释（-- 后面的内容）
    const lines = s.split('\n').map(line => {
      const commentIndex = line.indexOf('--');
      return commentIndex >= 0 ? line.substring(0, commentIndex).trim() : line.trim();
    });
    const cleaned = lines.filter(l => l.length > 0).join(' ');
    return cleaned.length > 0;
  })
  .map(s => {
    // 移除行内注释
    const lines = s.split('\n').map(line => {
      const commentIndex = line.indexOf('--');
      return commentIndex >= 0 ? line.substring(0, commentIndex).trim() : line.trim();
    });
    return lines.filter(l => l.length > 0).join(' ');
  });

console.log(`Found ${statements.length} SQL statements to execute`);

// 执行每个 SQL 语句（顺序执行，确保外键依赖正确）
let executed = 0;
const executeStatements = async () => {
  for (let index = 0; index < statements.length; index++) {
    const statement = statements[index];
    if (statement) {
      console.log(`Executing statement ${index + 1}: ${statement.substring(0, 50)}...`);
      await new Promise((resolve) => {
        db.query(statement + ';', (err, results) => {
          if (err) {
            // 如果是 DROP TABLE 且表不存在，忽略错误
            if (statement.toUpperCase().includes('DROP TABLE') && err.code === 'ER_BAD_TABLE_ERROR') {
              console.log(`Table does not exist, skipping DROP statement ${index + 1}...`);
            } else if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_KEYNAME') {
              console.log(`Table already exists, skipping statement ${index + 1}...`);
            } else {
              console.error(`Error executing statement ${index + 1}:`, err.message);
              console.error(`Statement was:`, statement.substring(0, 200));
            }
          } else {
            executed++;
            console.log(`Statement ${index + 1} executed successfully`);
            if (results && results.affectedRows !== undefined) {
              console.log(`  Affected rows: ${results.affectedRows}`);
            }
          }
          resolve();
        });
      });
      // 等待一下，确保表创建完成
      if (statement.toUpperCase().includes('CREATE TABLE')) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // CREATE TABLE 后等待1秒
      } else if (statement.toUpperCase().includes('ALTER TABLE') && statement.toUpperCase().includes('FOREIGN KEY')) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 添加外键前等待0.5秒
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
};

executeStatements().then(() => {
  console.log(`Database initialization completed. ${executed} statements executed.`);
});

// 这个日志会在异步执行前打印，所以是正常的

