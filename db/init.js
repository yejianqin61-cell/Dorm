// 数据库初始化脚本
const db = require('./index.js');
const fs = require('fs');
const path = require('path');

// 读取 SQL 文件
const sqlFile = path.join(__dirname, 'init.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// 分割 SQL 语句（按分号分割，过滤空语句）
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

// 执行每个 SQL 语句
let executed = 0;
statements.forEach((statement, index) => {
  if (statement) {
    db.query(statement + ';', (err, results) => {
      if (err) {
        // 如果表已存在，忽略错误
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_KEYNAME') {
          console.log(`Table already exists, skipping...`);
        } else {
          console.error(`Error executing statement ${index + 1}:`, err.message);
        }
      } else {
        executed++;
        console.log(`Statement ${index + 1} executed successfully`);
      }
    });
  }
});

console.log('Database initialization completed');

