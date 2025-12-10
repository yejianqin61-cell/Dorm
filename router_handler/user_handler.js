const db = require('../db/index.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../schemas/config.js');

// ================== 注册 ==================
exports.regUser = (req, res) => {
  const userinfo = req.body;

  const sqlStr = 'select id from ev_users where student_id=? or email=?';
  db.query(sqlStr, [userinfo.student_id, userinfo.email], (err, results) => {
    if (err) return res.cc(err);

    if (results.length > 0) return res.cc('学号或邮箱已被注册，请更换！');

    const hashedPassword = bcrypt.hashSync(userinfo.password, 10);

    const sql = 'insert into ev_users set ?';
    const userData = {
      student_id: userinfo.student_id,
      email: userinfo.email,
      password: hashedPassword,
      nickname: userinfo.student_id,  // 默认昵称=学号
      picture: null                  // 初始头像为空
    };

    db.query(sql, userData, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！');

      res.send({
        status: 0,
        message: '注册成功！',
        data: {
          student_id: userinfo.student_id
        }
      });
    });
  });
};


// ================== 登录 ==================
exports.login = (req, res) => {
  const userinfo = req.body;

  const sql = 'select id, student_id, email, password, nickname, picture, is_admin from ev_users where student_id=?';

  db.query(sql, userinfo.student_id, (err, results) => {
    if (err) return res.cc(err);

    if (results.length !== 1) {
      // 开发/演示兜底账号，便于本地快速验证登录流程
      const demoId = process.env.DEMO_STUDENT_ID || 'CST1234567';
      const demoPwd = process.env.DEMO_PASSWORD || '123456';
      if (userinfo.student_id === demoId && userinfo.password === demoPwd) {
        const user = { id: -1, student_id: demoId, email: 'demo@example.com' };
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        return res.send({
          status: 0,
          message: '登录成功！（演示账号）',
          token: tokenStr,
          data: {
            id: -1,
            student_id: demoId,
            email: 'demo@example.com',
            nickname: demoId,
            picture: null
          }
        });
      }
      return res.cc('登录失败，用户不存在！');
    }

    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
    if (!compareResult) return res.cc('登录失败，密码错误！');

    const user = {
      id: results[0].id,
      student_id: results[0].student_id,
      is_admin: results[0].is_admin || 0
    };

    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });

    res.send({
      status: 0,
      message: '登录成功！',
      token: tokenStr,
      data: {
        id: results[0].id,
        student_id: results[0].student_id,
        email: results[0].email,
        nickname: results[0].nickname,
        picture: results[0].picture,
        is_admin: results[0].is_admin || 0
      }
    });
  });
};
