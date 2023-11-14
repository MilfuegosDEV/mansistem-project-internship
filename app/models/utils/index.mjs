import db from "../../../db/index.mjs";

/**
 * Recupera los tipos de estados que hay en la base de datos (habilitado, inhabilitado)
 * @returns {Promise<Array<object>>} Una promesa que se resuelve mediante un arreglo de estados.
 */
export function status() {
  try {
    const QUERY = "SELECT * FROM STATUS";
    const [results] = db.query(QUERY);
    return results;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera los roles que hay en la base de datos;
 * @returns {Promise<Array<object>>} Una promesa que se resulve mediante un arreglo de roles.
 */
export function roles() {
  try {
    const QUERY = "SELECT * FROM USER_ROL";
    const [results] = db.query(QUERY);
    return results;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera todas las provincias que hay en la base de datos.
 * @returns {Promise<Array<object>>} Una promesa que se resuelve mediante un arreglo de provincias.
 */
export function provinces() {
  try {
    const QUERY = "SELECT * FROM PROVINCE";
    const [results] = db.query(QUERY);
    return results;
  } catch (err) {
    throw new Error(err);
  }
}