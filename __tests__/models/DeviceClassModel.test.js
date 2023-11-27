import DeviceClassModel from "../../app/models/DeviceClassModel.mjs";
import db from "../../db/index.mjs";

jest.mock("../../db/index.mjs", () => ({
  query: jest.fn(),
}));

describe("DeviceClassModel - findByName", () => {
  test("should return device class data if name is found", async () => {
    const mockName = "DeviceClassName";
    const mockResponse = [{ id: 1, name: "DeviceClassName", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceClassModel.findByName(mockName);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name, status_id FROM DEVICE_CLASS WHERE name = ?",
      [mockName.toUpperCase().trim()]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if name is not provided", async () => {
    const result = await DeviceClassModel.findByName("");
    expect(result).toBeUndefined();
  });
});

describe("DeviceClassModel - getEnabled", () => {
  test("should return all enabled device classes", async () => {
    const mockResponse = [
      { id: 1, name: "Class1" },
      { id: 2, name: "Class2" },
    ];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceClassModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM DEVICE_CLASS WHERE status_id = ?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("DeviceClassModel - getById", () => {
  test("should return device class data if id is found", async () => {
    const mockId = 1;
    const mockResponse = [{ id: 1, name: "DeviceClassName", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceClassModel.getById(mockId);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM DEVICE_CLASS WHERE id=?",
      [mockId]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if id is not provided", async () => {
    const result = await DeviceClassModel.getById(undefined);
    expect(result).toBeUndefined();
  });
});
