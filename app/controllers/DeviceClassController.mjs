import db from "../../db/index.mjs";
import Triggers from "../../db/triggers/index.mjs";

class DeviceClassController extends Triggers {
  constructor() {
    super("DEVICE_CLASS");
  }
  async add(name, performed_by_user_id) {
    if (!name || !performed_by_user_id) return 0;
    try {
      const QUERY = "INSERT INTO DEVICE_CLASS (name) VALUES (?)";

      await db.query(QUERY, [name]);

      await this.InsertionAudit(performed_by_user_id);
      return 1;
    } catch (err) {
      console.error("Error:", err);
      return 0;
    }
  }
  async edit(updated_id, status, performed_by_user_id) {
    if (typeof status === "undefined") return 0;
    try {
      const QUERY = "UPDATE DEVICE_CLASS SET status_id=? WHERE id=?";
      await this.UpdateAudit(performed_by_user_id, updated_id, {
        status_id: status,
      });
      await db.query(QUERY, [status, updated_id]);
      return 1;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}

export default new DeviceClassController();
