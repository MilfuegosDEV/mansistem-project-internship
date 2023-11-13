// Función de validación para verificar campos no vacíos
export const checkNotEmpty = (value, field) => {
  if (!value || value.trim().length === 0) {
    // trim() elimina los espacios en blanco.
    return { msg: `El campo ${field} es requerido.` };
  }
  return null;
};

// Función para verificar que un campo no contenga espacios en blanco.
export const checkForBlank = (value, field) => {
  if (/\s/.test(value))
    return { msg: `El campo ${field} no puede tener espcios en blanco.` };
  return null;
};

// Función de validación para verificar la longitud mínima
export const checkMinLength = (value, minLength, field) => {
  if (!value || value.length < minLength) {
    return {
      msg: `El campo ${field} debe tener al menos ${minLength} caracteres.`,
    };
  }
  return null;
};

// Función de validación para verificar la longitud máxima de un
export const checkMaxLength = (value, maxLength, field) => {
  if (value.length > maxLength) {
    return { msg: `El campo de ${field} no debe ser superior a ${maxLength}` };
  }
  return null;
};

// Función de validación para verificar si las contraseñas coinciden
export const checkPasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { msg: "Las contraseñas no coinciden." };
  }
  return null;
};

// Función de validación para verificar si una cadena es solamente números
export const checkPhoneNumber = (value, field) => {
  const regex = /^[0-9]*$/;
  if (!regex.test(value)) {
    return { msg: `El campo ${field} solamente acepta números` };
  }
  return null;
};

// Middleware para manejar los errores de validación
export const handleValidation = (validations, req, _res) => {
  const errors = [];
  validations.forEach((validation) => {
    const result = validation(req);
    if (result) {
      errors.push(result);
    }
  });

  if (errors.length) {
    return errors; // Indica que hubo errores
  }
  return null; // Indica que no hubo errores
};
