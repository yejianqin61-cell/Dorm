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
  // 否则使用分开的变量
  dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : (process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '20061016177Jack',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'my_db'
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
