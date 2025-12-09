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

// 执行每个 SQL 语句（顺序执行，确保外键依赖正确）
let executed = 0;
const executeStatements = async () => {
  for (let index = 0; index < statements.length; index++) {
    const statement = statements[index];
    if (statement) {
      await new Promise((resolve) => {
        db.query(statement + ';', (err, results) => {
          if (err) {
            // 如果表已存在，忽略错误
            if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_KEYNAME') {
              console.log(`Table already exists, skipping statement ${index + 1}...`);
            } else {
              console.error(`Error executing statement ${index + 1}:`, err.message);
            }
          } else {
            executed++;
            console.log(`Statement ${index + 1} executed successfully`);
          }
          resolve();
        });
      });
      // 等待一下，确保表创建完成
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

executeStatements().then(() => {
  console.log(`Database initialization completed. ${executed} statements executed.`);
});

console.log('Database initialization completed');

