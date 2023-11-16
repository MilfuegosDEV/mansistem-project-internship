import UserModel from "../app/models/UserModel.mjs";

test("findById resolves object", () => {
  const result = UserModel.findById(1);
  expect(result).resolves.toBeDefined();
  expect(typeof result).toBe("object");
});

test("findByUsername resolves object", () => {
  const result = UserModel.findByUsername("milfuegosdev");
  expect(result).resolves.toBeDefined();
  expect(result).resolves.toBe("object");
});

test("getEnabled resolves array", () => {
  const result = UserModel.getEnabled();
  expect(result).resolves.toBeDefined();
  expect(result).resolves.toEqual(expect.any(Array));
});
