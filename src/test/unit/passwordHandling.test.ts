import { expect } from "chai";
import { hashPassword, comparePassword } from "../../services/passwordHandling";

//Test case for hashing the password
describe("hashing password", () => {
  it("should return hashed password", () => {
    expect(hashPassword("Mypassword@123")).to.be.a("string");
  });
});
//comparing the hashed password and raw password
describe("decrypting password", () => {
  it("should return true ", () => {
    expect(comparePassword("U2FsdGVkX18qyff/esk0T1VqlAdDOMPrvdezDWl/mA4=", "Mypassword@123")).to.be.true;
  });
  it("should return false if wrong password", () => {
    expect(comparePassword("U2FsdGVkX18qyff/esk0T1VqlAdDOMPrvdezDWl/mA4=", "Mypasswod@123")).to.be.false;
  });
});
