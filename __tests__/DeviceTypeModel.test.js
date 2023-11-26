import DeviceTypeModel from "../app/models/DeviceTypeModel.mjs";

describe("DeviceTypeModel's tests", () => {
  test("getEnabledByClass test", async () => {
    const items = await DeviceTypeModel.getEnabledByClass(1);
    expect(Array.isArray(items)).toBe(true);
    items.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
    });
  });
});
