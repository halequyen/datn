const User = require("../models/User");
const jwt = require("jsonwebtoken");

class UserController {
  index(req, res, next) {
    User.find({})
      .then((users) => res.json(users))
      .catch(next);
  }

  create(req, res, next) {
    const userData = req.body;
    User.create(userData)
      .then((users) => {
        console.log(users);
        return res.json(users);
      })
      .catch(next);
  }

  update(req, res, next) {
    const userId = req.params.id;
    const updatedUserData = req.body;
    User.findByIdAndUpdate(userId, updatedUserData, { new: true })
      .then((users) => res.json(users))
      .catch(next);
  }

  delete(req, res, next) {
    const userId = req.params.id;
    console.log(userId);
    User.findByIdAndDelete(userId)
      .then(() => res.json({ message: "User deleted successfully" }))
      .catch(next);
  }

  login(req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;
    User.findOne({
      userName: userName,
      password: password,
    })
      .then((user) => {
        if (user) {
          var token = jwt.sign(
            {
              _id: user._id,
            },
            "mk"
          );
          return res.status(200).json({
            message: "Đăng nhập thành công",
            token: token,
            userName: userName,
            type: user.type,
            owner: user.owner,
            password: user.password,
          });
        } else {
          return res.status(200).json("Tài khoản hoặc mật khẩu không đúng");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json("Lỗi server");
      });
  }

  refresh(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("Bạn phải đăng nhập");
    jwt.verify(refreshToken, "mk", (err, decoded) => {
      if (err) {
        return res.status(401).json("Token không hợp lệ");
      }
      const userId = decoded._id;
      User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.status(404).json("Người dùng không tồn tại");
          }
          var token = jwt.sign(
            {
              _id: user._id,
            },
            "mk"
          );
          return res.status(200).json({
            token: token,
            userName: user.userName,
            type: user.type,
            owner: user.owner,
            password: user.password,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json("Lỗi server");
        });
    });
  }

  logout(req, res, next) {
    res.clearCookie("token");
    return res.json({ message: "Đăng xuất thành công" });
  }
}

module.exports = new UserController();
