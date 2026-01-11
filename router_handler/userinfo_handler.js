const db = require('../db/index.js');
const bcrypt = require('bcryptjs');  // 确保导入 bcryptjs

exports.getUserInfo = (req, res) => {
  const sql = 'select id, student_id, nickname, email, picture from ev_users where id=?';

  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err);

    if (results.length !== 1) return res.cc('获取用户信息失败！');

    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0],
    });
  });
};

// ================== 更新用户信息 ==================
exports.updateUserInfo = (req, res) => {
  const { nickname, email } = req.body;
  const sql = 'update ev_users set nickname=?, email=? where id=?';
  db.query(sql, [nickname, email, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更新用户信息失败！');
    res.cc('更新用户信息成功！', 0);
  });
};

// ================== 更新密码 ==================
exports.updatePassword = (req, res) => {
  const sql = 'select password from ev_users where id=?';

  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('用户不存在！');

    // 验证旧密码
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
    if (!compareResult) return res.cc('原密码错误！');

    // 加密新密码
    const newPassword = bcrypt.hashSync(req.body.newPwd, 10);

    const updateSql = 'update ev_users set password=? where id=?';

    db.query(updateSql, [newPassword, req.user.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('更新密码失败！');
      res.cc('更新密码成功！', 0);
    });
  });
};


// ================== 更新头像 ==================
exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set picture=? where id=?';
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更新头像失败！');
    res.cc('更新头像成功！', 0);
  });
};