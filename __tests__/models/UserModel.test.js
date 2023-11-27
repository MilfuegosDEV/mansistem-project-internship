import UserModel from "../../app/models/UserModel.mjs";
import db from "../../db/index.mjs";

jest.mock("../../db/index.mjs", () => ({
  query: jest.fn(),
}));

describe("UserModel - findByUsername", () => {
  test("should return user data if username is found", async () => {
    const mockUsername = "user123";
    const mockResponse = [{ id: 1, username: "user123", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await UserModel.findByUsername(mockUsername);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM USER WHERE username = ?",
      [mockUsername.toLowerCase().trim()]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if username is not provided", async () => {
    const result = await UserModel.findByUsername("");
    expect(result).toBeUndefined();
  });
});

describe("UserModel - findById", () => {
  test("should return user data if user id is found", async () => {
    const mockId = 1;
    const mockResponse = [{ id: 1, username: "user123", status_id: 1 }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await UserModel.findById(mockId);
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM USER WHERE id = ?", [
      mockId,
    ]);
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if id is not provided", async () => {
    const result = await UserModel.findById(undefined);
    expect(result).toBeUndefined();
  });
});


describe('UserModel - getEnabled', () => {
  test("should return all enabled users", async () => {
    const mockResponse = [
      { id: 1, name: "John", last_name: "Doe", status_id: 1 },
      { id: 2, name: "Jane", last_name: "Doe", status_id: 1 }
    ];
    db.query.mockResolvedValue([mockResponse]);

    const result = await UserModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name, last_name FROM USER WHERE status_id = ?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});
