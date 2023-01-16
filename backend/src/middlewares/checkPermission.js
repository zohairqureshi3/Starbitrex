const user = require("../models/user");


// ------------  ToDo -------------. 
exports.checkPermission = function (role) {
  return async (req, res, next) => {
    try {
      var user_id = req.user
      var reqRole = Role.Admin
      var i;
      for (i = 0; i < role.length; i++) {
        if (reqRole == role[i]) {
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