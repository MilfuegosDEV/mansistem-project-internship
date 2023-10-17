const AuthController = require("../controllers/register");
const registerController = new AuthController();
const express = require("express");
const router = express.Router();
// Models
const ModelProvince = require("../models/province");
const ModeluserRoles = require("../models/usersRoles");

const provinceModel = new ModelProvince();
const userRolesModel = new ModeluserRoles(); 

// Manejo de registro
router.post("/register", async (req, res) => {
  const {
    name,
    lastname,
    username,
    email,
    password,
    password2,
    role,
    province,
  } = req.body;

  let errors = [];

  if (
    !name ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !password2 ||
    !role ||
    !province
  ) {
    errors.push({ msg: "Por favor, rellene todos los campos" });
  }

  if (password !== password2) {
    errors.push({ msg: "Las contraseñas no coinciden" });
  }

  if (password.length < 6) {
    errors.push({ msg: "La contraseña debe tener al menos 6 caracteres" });
  }

  if (errors.length > 0) {
    // Si hay errores, renderizamos la página de registro con los errores
    req.flash("errors", errors);
    res.render("register", {
      layout: false,
      title: "Register",
      message: req.flash(),
      name,
      lastname,
      username,
      email,
      password,
      password2,
      role,
      province,
      provinces: await provinceModel.getAll(),
      userRoles: await userRolesModel.getAll(),
    });
  } else {
    try {
      // Verificar si el usuario ya existe
      if (await registerController.doesUserExist(username)) {
        errors.push({ msg: "El nombre de usuario ya está en uso" });
        req.flash("errors", errors);
        res.render("register", {
          layout: false,
          title: "Register",
          message: req.flash(),
          name,
          lastname,
          username,
          email,
          password,
          password2,
          role,
          province,
          provinces: await provinceModel.getAll(),
          userRoles: await userRolesModel.getAll(),
        });
      } else {
        // Si no hay errores y el usuario no existe, procedemos a crear el nuevo usuario

        await registerController.addUser(
          name,
          lastname,
          username,
          email,
          password,
          role,
          province
        );

        // Aquí, podrías querer enviar un mensaje de éxito o redirigir al usuario a la página de inicio de sesión
        req.flash(
          "success",
          "Te has registrado exitosamente"
        );
        res.redirect("/login"); // o donde sea que desees redirigir al usuario
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error del servidor");
    }
  }
});

module.exports = router;
