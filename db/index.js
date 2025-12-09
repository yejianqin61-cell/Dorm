const mysql = require('mysql2');

// 支持多种环境变量格式
// 优先级：MYSQL_URL > 分开的变量 > 默认值
let dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '20061016177Jack',
  database: 'my_db'
};

// 如果提供了完整的 MySQL URL，解析它
if (process.env.MYSQL_URL) {
  const url = new URL(process.env.MYSQL_URL);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', '')
  };
} else {
  // 否则使用分开的变量，并清理格式问题（去除 \n= 前缀等）
  const cleanEnv = (val) => val ? val.replace(/^[\n=]+/, '').trim() : null;
  
  dbConfig = {
    host: cleanEnv(process.env.DB_HOST) || cleanEnv(process.env.MYSQLHOST) || 'switchback.proxy.rlwy.net',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : (process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : 37445),
    user: cleanEnv(process.env.DB_USER) || cleanEnv(process.env.MYSQLUSER) || 'root',
    password: cleanEnv(process.env.DB_PASSWORD) || cleanEnv(process.env.MYSQLPASSWORD) || '20061016177Jack',
    database: cleanEnv(process.env.DB_NAME) || cleanEnv(process.env.MYSQLDATABASE) || 'railway'
  };
}

// 调试：打印使用的数据库配置（不打印密码）
console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  usingMYSQL_URL: !!process.env.MYSQL_URL
});

const db = mysql.createPool(dbConfig);

module.exports = db;
