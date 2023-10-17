const RegisterController = require('../controllers/register');
const controllerRegister = new RegisterController;

// validationMiddleware.js

// Función de validación para verificar campos no vacíos
const checkNotEmpty = (value, field) => {
  if (!value || value.trim().length === 0) {
    return `${field} es requerido.`;
  }
  return null;
};

// Función de validación para verificar la longitud mínima
const checkMinLength = (value, minLength) => {
  if (!value || value.length < minLength) {
    return `Debe tener al menos ${minLength} caracteres.`;
  }
  return null;
};

// Función de validación para verificar si las contraseñas coinciden
const checkPasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }
  return null;
};
const checkUserExists =  (username) => {
  return controllerRegister.doesUserExist(username) ? 'Usuario ya registrado' : '';
}

// Middleware para manejar los errores de validación
const handleValidation = (validations, req, res, next) => {
  const errors = [];
  validations.forEach((validation) => {
    const result = validation(req);
    if (result) {
      errors.push(result);
    }
  });

  if (errors.length) {
    req.flash("errors", errors);
    res.status(400).redirect("/register");
  } else {
    next();
  }
};

module.exports = {
  checkNotEmpty,
  checkMinLength,
  checkPasswordsMatch,
  checkUserExists,
  handleValidation,
};
