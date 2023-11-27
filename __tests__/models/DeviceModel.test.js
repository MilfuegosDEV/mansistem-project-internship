import DeviceModel from "../../app/models/DeviceModel.mjs";
import db from "../../db/index.mjs";

jest.mock("../../db/index.mjs", () => ({
  query: jest.fn(),
}));

describe("DeviceModel - find", () => {
  test("should return device data if all parameters match", async () => {
    const mockName = "DeviceName";
    const mockTypeId = 1;
    const mockClassId = 2;
    const mockSupplierId = 3;
    const mockResponse = [{ id: 1, model: "DeviceName" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceModel.find(
      mockName,
      mockTypeId,
      mockClassId,
      mockSupplierId
    );
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, model FROM DEVICE WHERE model=? AND device_type_id=? AND device_class_id=? AND device_supplier_id=?",
      [mockName.toUpperCase().trim(), mockTypeId, mockClassId, mockSupplierId]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if any parameter is missing", async () => {
    const result = await DeviceModel.find("DeviceName", null, 2, 3);
    expect(result).toBeUndefined();
  });
});

describe("DeviceModel - getEnabled", () => {
  test("should return all enabled devices", async () => {
    const mockResponse = [
      { id: 1, name: "Device1" },
      { id: 2, name: "Device2" },
    ];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM DEVICE WHERE status_id=?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});
