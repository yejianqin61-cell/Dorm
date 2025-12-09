const mysql = require('mysql2');

// 允许通过环境变量覆盖数据库连接，默认值仅用于本地开发
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '20061016177Jack',
  database: process.env.DB_NAME || 'my_db'
});

module.exports = db;
