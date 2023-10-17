const provinceModel = require("../models/provinceModel");
const userRolesModel = require("../models/userRolModel");
// controllers/userController.js
exports.getRegister = async (req, res, next) => {
  try {
    const provinces = new provinceModel();
    const userRoles = new userRolesModel();
    res.render("register", {
      layout: false,
      title: "Register",
      message: req.flash(),
      provinces: await provinces.getAll(),
      userRoles: await userRoles.getAll(),
    });
  } catch (error) {
    next(error); // pasar el control al siguiente middleware de manejo de errores
  }
};
