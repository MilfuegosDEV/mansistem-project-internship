import DeviceTypeModel from "../../app/models/DeviceTypeModel.mjs";
import db from "../../db/index.mjs";

jest.mock("../../db/index.mjs", () => ({
  query: jest.fn(),
}));

describe('DeviceTypeModel - findByName', () => {
  test("should return data if name is found", async () => {
    const mockName = "FOO";
    const mockResponse = [{ id: 1, name: "FOO", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceTypeModel.findByName(mockName);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name, status_id FROM DEVICE_TYPE WHERE name=?",
      [mockName.toUpperCase().trim()]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if name is not provided", async () => {
    const result = await DeviceTypeModel.findByName('');
    expect(result).toBeUndefined();
  });
});

describe('DeviceTypeModel - findType', () => {
  test("should return data if name and class_id are found", async () => {
    const mockName = "FOO";
    const mockClassId = 123;
    const mockResponse = [{ id: 1, name: "FOO" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceTypeModel.findType(mockName, mockClassId);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM DEVICE_TYPE WHERE name=? AND device_class_id=?",
      [mockName.toUpperCase().trim(), mockClassId]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if name or class_id is not provided", async () => {
    const resultWithNameMissing = await DeviceTypeModel.findType('', 123);
    const resultWithClassIdMissing = await DeviceTypeModel.findType('FOO', undefined);
    expect(resultWithNameMissing).toBeUndefined();
    expect(resultWithClassIdMissing).toBeUndefined();
  });
});

describe('DeviceTypeModel - getEnabled', () => {
  test("should return all enabled device types", async () => {
    const mockResponse = [{ id: 1, name: "DeviceType1" }, { id: 2, name: "DeviceType2" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceTypeModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM DEVICE_TYPE WHERE status_id=?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('DeviceTypeModel - getEnabledByClass', () => {
  test("should return enabled device types by class", async () => {
    const mockDeviceClass = "class1";
    const mockResponse = [{ id: 1, name: "DeviceType1" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await DeviceTypeModel.getEnabledByClass(mockDeviceClass);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT DEVICE_TYPE.id, DEVICE_TYPE.name FROM DEVICE_TYPE WHERE DEVICE_TYPE.status_id = ? AND DEVICE_TYPE.device_class_id = ?",
      [1, mockDeviceClass]
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return undefined if deviceClass is not provided", async () => {
    const result = await DeviceTypeModel.getEnabledByClass('');
    expect(result).toBeUndefined();
  });
});
