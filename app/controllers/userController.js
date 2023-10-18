const provinceModel = require("../models/provinceModel");
const userRolesModel = require("../models/userRolModel");
// controllers/userController.js
exports.getRegister = async (req, res, next) => {
  try {
    res.render("register", {
      layout: false,
      title: "Register",
      message: req.flash(),
      provinces: await provinceModel.getAll(),
      userRoles: await userRolesModel.getAll(),
    });
  } catch (error) {
    next(error); // pasar el control al siguiente middleware de manejo de errores
  }
};
