import { assert, expect, should } from "chai";
import { generateToken, verifyToken } from "../../services/tokenHandling";
import { token } from "../integration/0-users.test";

describe("generate Token", () => {
  it("getting Valid token", () => {
    assert.typeOf(generateToken({ user_id: 1, role: "both" }), "string");
  });
});

describe("verify Token", () => {
  it("should return decoded token", () => {
    assert.typeOf(verifyToken(token), "object");
  });
});
