import db from "../../db/index.mjs";
import Triggers from "../../db/triggers/index.mjs";
import DeviceSupplierModel from "../models/DeviceSupplierModel.mjs";
import DeviceClassModel from "../models/DeviceClassModel.mjs";
import DeviceTypeModel from "../models/DeviceTypeModel.mjs";

class DeviceController extends Triggers {
  constructor() {
    super("DEVICE");
  }

  /**
   * Ingresa un nuevo dispositivo
   * @param {string} model
   * @param {number} device_class_id
   * @param {number} device_supplier_id
   * @param {number} device_type_id
   * @param {number} user_id Usuario que realiza la acción
   * @returns
   */
  async add(
    model,
    device_class_id,
    device_supplier_id,
    device_type_id,
    user_id
  ) {
    if (!model || !device_class_id || !device_supplier_id || !device_type_id)
      return 0;
    try {
      const QUERY =
        "INSERT INTO DEVICE (model, device_class_id, device_supplier_id, device_type_id) \
         VALUES (?,?,?,?)";
      await db.query(QUERY, [
        model,
        device_class_id,
        device_supplier_id,
        device_type_id,
      ]);

      await this.InsertionAudit(user_id);
      return 1;
    } catch (error) {
      console.log("Error ", error);
      return 0;
    }
  }
  /**
   *
   * @param {number} performed_by_user_id El usuario que realizó la acción
   * @param {string} className
   * @param {string} supplier,
   * @param {string} typeName
   * @param {number} status
   * @param {number} updated_id El id del dispositivo que será actualizado
   */
  async edit(
    performed_by_user_id,
    className,
    supplier,
    typeName,
    status,
    updated_id
  ) {
    if (!className || !supplier || !typeName || typeof status === "undefined")
      return 0;
    try {
      // Verifica si la clase o el proveedor están habilitados
      const supplierInfo = await DeviceSupplierModel.findByName(supplier);
      const classInfo = await DeviceClassModel.findByName(className);
      const typeInfo = await DeviceTypeModel.findByName(typeName);

      if (supplierInfo.status_id && classInfo.status_id && typeInfo.status_id) {
        const QUERY = "UPDATE DEVICE SET status_id=? WHERE id=?";
        await this.UpdateAudit(performed_by_user_id, updated_id, {
          status_id: status,
        });
        await db.query(QUERY, [status, updated_id]);
        return 1;
      }
      return null;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}

export default new DeviceController();
