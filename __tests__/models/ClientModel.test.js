import ClientModel from "../../app/models/ClientModel.mjs";
import db from "../../db/index.mjs";

jest.mock("../../db/index.mjs", () => ({
  query: jest.fn(),
}));

describe("ClientModel - findByName", () => {
  test("should return client data if name is found", async () => {
    const mockName = "ClientName";
    const mockResponse = [{ id: 1, name: "ClientName" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await ClientModel.findByName(mockName);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM CLIENT WHERE name = ?",
      [mockName.toUpperCase().trim()]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if name is not provided", async () => {
    const result = await ClientModel.findByName("");
    expect(result).toBeUndefined();
  });
});

describe("ClientModel - findByEmail", () => {
  test("should return client data if email is found", async () => {
    const mockEmail = "client@example.com";
    const mockResponse = [{ id: 1, name: "ClientName" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await ClientModel.findByEmail(mockEmail);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM CLIENT WHERE email = ?",
      [mockEmail.toLowerCase().trim()]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if email is not provided", async () => {
    const result = await ClientModel.findByEmail("");
    expect(result).toBeUndefined();
  });
});
describe("ClientModel - findByPhoneNumber", () => {
  test("should return client data if phone number is found", async () => {
    const mockPhone = "1234567890";
    const mockResponse = [{ id: 1, name: "ClientName" }];
    db.query.mockResolvedValue([mockResponse]);

    const result = await ClientModel.findByPhoneNumber(mockPhone);
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM CLIENT WHERE phone = ?",
      [mockPhone]
    );
    expect(result).toEqual(mockResponse[0]);
  });

  test("should return undefined if phone number is not provided", async () => {
    const result = await ClientModel.findByPhoneNumber("");
    expect(result).toBeUndefined();
  });
});

describe("ClientModel - getEnabled", () => {
  test("should return all enabled clients", async () => {
    const mockResponse = [
      { id: 1, name: "Client1" },
      { id: 2, name: "Client2" },
    ];
    db.query.mockResolvedValue([mockResponse]);

    const result = await ClientModel.getEnabled();
    expect(db.query).toHaveBeenCalledWith(
      "SELECT id, name FROM CLIENT WHERE status_id = ?",
      [1]
    );
    expect(result).toEqual(mockResponse);
  });
});
