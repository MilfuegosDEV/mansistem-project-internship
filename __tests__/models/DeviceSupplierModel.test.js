import DeviceSupplierModel from "../../app/models/DeviceSupplierModel.mjs";
import db from "../../db/index.mjs";

jest.mock("../../db/index.mjs", () => ({
  query: jest.fn(),
}));

describe("DeviceSupplierModel - findByName", () => {
  test("should return supplier data if name is found", async () => {
    const mockName = "SupplierName";
    const mockResponse = [{ id: 1, name: "SupplierName", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceSupplierModel.findByName(mockName);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name, status_id FROM DEVICE_SUPPLIER WHERE name = ?",
      [mockName.toUpperCase().trim()]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if name is not provided", async () => {
    const result = await DeviceSupplierModel.findByName("");
    expect(result).toBeUndefined();
  });
});

describe("DeviceSupplierModel - getEnabled", () => {
  test("should return all enabled suppliers", async () => {
    const mockResponse = [
      { id: 1, name: "Supplier1" },
      { id: 2, name: "Supplier2" },
    ];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceSupplierModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM DEVICE_SUPPLIER WHERE status_id=?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("DeviceSupplierModel - getEnabled", () => {
  test("should return all enabled suppliers", async () => {
    const mockResponse = [
      { id: 1, name: "Supplier1" },
      { id: 2, name: "Supplier2" },
    ];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceSupplierModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM DEVICE_SUPPLIER WHERE status_id=?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("DeviceSupplierModel - getById", () => {
  test("should return supplier data if id is found", async () => {
    const mockId = 1;
    const mockResponse = [{ id: 1, name: "SupplierName", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceSupplierModel.getById(mockId);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM DEVICE_SUPPLIER WHERE id=?",
      [mockId]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if id is not provided", async () => {
    const result = await DeviceSupplierModel.getById(undefined);
    expect(result).toBeUndefined();
  });
});
