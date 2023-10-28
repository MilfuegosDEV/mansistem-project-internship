// validationMiddleware.js

// Función de validación para verificar campos no vacíos
const checkNotEmpty = (value, field) => {
  if (!value || value.trim().length === 0) {
    // trim() elimina los espacios en blanco.
    return `${field} es requerido.`;
  }
  return null;
};

// Función de validación para verificar la longitud mínima
const checkMinLength = (value, minLength) => {
  if (!value || value.length < minLength) {
    return `La contraseña debe tener al menos ${minLength} caracteres.`;
  }
  return null;
};

// Función de validación para verificar la longitud máxima de un
const checkMaxLength = (value, maxLength, field) => {
  if (value.length > maxLength) {
    return `El campo de ${field} no debe ser superior a ${maxLength}`;
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
// Middleware para manejar los errores de validación
const handleValidation = (validations, req, res) => {
  const errors = [];
  validations.forEach((validation) => {
    const result = validation(req);
    if (result) {
      errors.push(result);
    }
  });

  if (errors.length) {
    res.status(400).json({ error: errors });
  }
};

module.exports = {
  checkNotEmpty,
  checkMinLength,
  checkMaxLength,
  checkPasswordsMatch,
  handleValidation,
};
