import chaiHttp from "chai-http";
import chai from "chai";
import { describe, before } from "mocha";
chai.use(chaiHttp);
import app from "../../app";
import { User } from "src/models/User";
import { generateToken } from "src/services/tokenHandling";
import { OrderItems } from "src/models/Order_items";
import { Order } from "src/models/Orders";
import { Product } from "src/models/Products";
import { db } from "src/services/db";
import { TimeoutError } from "sequelize";
chai.should();

export let token: string;
export let AdminToken: string;
describe("/register", () => {
  before(async function () {
    await db.sync({ force: true });
  });
  it("should return user object", done => {
    const user = { name: "jai", email: "gjai456@gmail.com", password: "MyPassword@123", role: "both" };
    chai
      .request(app)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("user_id");
        res.body.should.have.property("name");
        res.body.should.have.property("email");
        res.body.should.have.property("password");
        res.body.should.have.property("role");
        done();
      });
  });
  it("should return error if name is empty", done => {
    const user = { name: "", email: "gjai456@gmail.com", password: "MyPassword@123", role: "both" };
    chai
      .request(app)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"name" is not allowed to be empty`);
        done();
      });
  });
  it("should return error if email is empty", done => {
    const user = { name: "jai", email: "", password: "MyPassword@123", role: "both" };
    chai
      .request(app)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"email" is not allowed to be empty`);
        done();
      });
  });
  it("should return error if email pattern mismatch", done => {
    const user = { name: "jai", email: "gjai456@gmail", password: "MyPassword@123", role: "both" };
    chai
      .request(app)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"email" must be a valid email`);
        done();
      });
  });
  //Password validation
  it("should return error if password pattern mismatch", done => {
    const user = {
      name: "jai",
      email: "gjai456@gmail.com",
      password: "MyPassword",
      role: "both",
    };
    chai
      .request(app)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Password constrain failed`);
        done();
      });
  });

  //role
  it("should return error if role is not valid", done => {
    const user = {
      name: "jai",
      email: "gjai456@gmail.com",
      password: "MyPassword@123",
      role: "all",
    };
    chai
      .request(app)
      .post("/register")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"role" must be one of [seller, buyer, both, admin]`);
        done();
      });
  });
});
//Login API
describe("/login", () => {
  it("should return token object if login credentials are correct", done => {
    const loginDetails = { email: "gjai456@gmail.com", password: "MyPassword@123" };
    chai
      .request(app)
      .post("/login")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        token = res.body.token;
        done();
      });
  });
  it("should error if email is invalid", done => {
    const loginDetails = { email: "gjai456@gmail", password: "MyPassword@123" };
    chai
      .request(app)
      .post("/login")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"email" must be a valid email`);
        done();
      });
  });
  it("should return error if password do not match the constrain  ", done => {
    const loginDetails = { email: "gjai456@gmail.com", password: "MyPassword@" };
    chai
      .request(app)
      .post("/login")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Password constrain failed`);
        done();
      });
  });
  it("should return error if user is not registered", done => {
    const loginDetails = { email: "sample@gmail.com", password: "MyPassword@123" };
    chai
      .request(app)
      .post("/login")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Email Not found in db`);
        done();
      });
  });
  it("should return error if password  is not wrong", done => {
    const loginDetails = { email: "gjai456@gmail.com", password: "MyPassword@321" };
    chai
      .request(app)
      .post("/login")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Invalid Password`);
        done();
      });
  });
});
//change password
describe("/change-password", () => {
  it("should return error if old password do not match constrain", done => {
    const loginDetails = { oldPassword: "MyPassword@", newPassword: "MyPassword@321" };
    chai
      .request(app)
      .post("/change-password")
      .send(loginDetails)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Enter valid Old Password`);
        done();
      });
  });
  it("should return error if  New password  do not match constrain", done => {
    const loginDetails = { oldPassword: "MyPassword@123", newPassword: "MyPassword@" };
    chai
      .request(app)
      .post("/change-password")
      .send(loginDetails)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Enter valid New Password`);
        done();
      });
  });
  it("should return error if  no token is provided", done => {
    const loginDetails = { oldPassword: "MyPassword@123", newPassword: "MyPassword@321" };
    chai
      .request(app)
      .post("/change-password")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("should return error if old password is wrong", done => {
    const loginDetails = { oldPassword: "MyPassword@321", newPassword: "MyPassword@321" };
    chai
      .request(app)
      .post("/change-password")
      .send(loginDetails)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Invalid Old password`);
        done();
      });
  });
  it("should return success message credentials are correct", done => {
    const loginDetails = { oldPassword: "MyPassword@123", newPassword: "MyPassword@321" };
    chai
      .request(app)
      .post("/change-password")
      .send(loginDetails)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Successfully Changed`);
        done();
      });
  });
});
//Getting all Users By Admin
describe("/user/all", () => {
  it("should return success message credentials are correct", done => {
    AdminToken = generateToken({ user_id: 1, role: "admin" });
    chai
      .request(app)
      .get("/user/all")
      .set({ Authorization: `Bearer ${AdminToken}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("should return Unauthorized message  if other than admin try to get details", done => {
    const sellerToken = generateToken({ user_id: 1, role: "seller" });
    chai
      .request(app)
      .get("/user/all")
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.error.should.equal("Unauthorized");
        done();
      });
  });
  it("should return Unauthorized message  if other than admin try to get details", done => {
    const sellerToken = generateToken({ user_id: 1, role: "seller" });
    chai
      .request(app)
      .get("/user/all")
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.error.should.equal("Unauthorized");
        done();
      });
  });
});
//Updating the shipping address

describe("/update/shipping", () => {
  it("should return error if  no token is provided in updating shipping", done => {
    const shipping = { shipping_address: "fake shipping" };
    chai
      .request(app)
      .patch("/update/shipping")
      .send(shipping)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("should return error if shipping address is empty", done => {
    const shipping = { shipping_address: "" };
    {
      chai
        .request(app)
        .patch("/update/shipping")
        .set({ Authorization: `Bearer ${token}` })
        .send(shipping)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.equal(`"shipping_address" is not allowed to be empty`);
          done();
        });
    }
  });
  it("should return success message if valid shipping address is provided", done => {
    const shipping = { shipping_address: "fake shipping" };
    {
      chai
        .request(app)
        .patch("/update/shipping")
        .set({ Authorization: `Bearer ${token}` })
        .send(shipping)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal(`updated successfully`);
          done();
        });
    }
  });
});
