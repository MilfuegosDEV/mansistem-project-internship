class Client {
  /**
   * Recupera todos los clientes.
   * @returns {Promise<Array>} Una promesa que se resuelve con un arreglo de clientes.
   */
  static async getAll() {
    try {
      const userRoles = await db.query("SELECT * FROM CLIENT");
      return userRoles;
    } catch (error) {
      console.error(error);
      throw new Error("Error al recuperar los clientes.");
    }
  }
}
