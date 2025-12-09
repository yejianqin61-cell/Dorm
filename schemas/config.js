// JWT 相关配置，支持从环境变量读取，默认值用于开发环境
module.exports = {
  jwtSecretKey: process.env.JWT_SECRET || 'XMUMDORMYEJIANQIN20251005gogogo',
  expiresIn: process.env.JWT_EXPIRES_IN || '10h'
};
