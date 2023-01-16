
const jwt = require("jsonwebtoken");
const Role = require('./role');

exports.access = function (role) {
  return async (req, res, next) => {
    try {
      var reqRole = Role.Admin
      var i;
      for (i = 0; i < role.length; i++) {
        if (reqRole === role[i]) {
          next();
          return;
        } else {
          return res.status(400).send({ message: "Access Denied!!" });
        }
      }
    } catch (e) {
      return res.json(e.message);
    }
  };
};