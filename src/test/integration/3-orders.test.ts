import chaiHttp from "chai-http";
import chai, { assert } from "chai";
import { describe, before } from "mocha";
import app from "../../app";
import { token } from "./0-users.test";
import { generateToken, verifyToken } from "src/services/tokenHandling";
import { send } from "process";
import { createProduct } from "src/dao/products.dao";
import { result } from "lodash";
chai.use(chaiHttp);

let AdminToken: string;
let product_id: number;
let order_id: number;
describe("Placing the order", () => {
  before(async function () {
    await chai.request(app).post("/register").send({ name: "Alex", email: "mjayaganeshan@gmail.com", password: "MyPassword@123", role: "admin" });
    const response = await chai.request(app).post("/login").send({ email: "mjayaganeshan@gmail.com", password: "MyPassword@123" });
    const product: any = await createProduct("testing Product", "test description", 10, 10, "alex");
    product_id = product.product_id;
    AdminToken = response.body.token;
  });
  it("should return error if body is empty", done => {
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("should return error if product_id is string", done => {
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product: [{ product_id: "1", quantity: 1 }] })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it("should return error if quantity is string", done => {
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product: [{ product_id: 1, quantity: "1" }] })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it("should return error if admin try to place order", done => {
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${AdminToken}` })
      .send({ product: [{ product_id: product_id, quantity: 1 }] })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equals("Unauthorized");
        done();
      });
  });
  it("should return error if invalid user try to place order", done => {
    const fakeToken = generateToken({ user_id: 1000000000, role: "both" });
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .send({ product: [{ product_id: product_id, quantity: 1 }] })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equals("No user found");
        done();
      });
  });
  it("should return error if invalid product id is sent ", done => {
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product: [{ product_id: 100000000, quantity: 1 }] })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });
  it("should return successful message if valid product details are sent", done => {
    chai
      .request(app)
      .post("/order/")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product: [{ product_id: product_id, quantity: 1 }] })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal("Order Placed Successfully");
        order_id = res.body.order_id;
        done();
      });
  });
});

// getting all orders by admin

describe("/get all orders by admin", () => {
  it("should return error if other than admin try to get all orders ", done => {
    chai
      .request(app)
      .get("/order/all")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal("Unauthorized");
        done();
      });
  });
  it("should return all orders array by admin", done => {
    chai
      .request(app)
      .get("/order/all")
      .set({ Authorization: `Bearer ${AdminToken}` })
      .end((err, res) => {
        console.log;
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});

// getting all orders by user

describe("/get all orders by user", () => {
  it("should return error if other than seller try to get all orders", done => {
    const sellerToken = generateToken({ user_id: 1, role: "seller" });
    chai
      .request(app)
      .get("/order/user")
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal("Unauthorized");
        done();
      });
  });
  it("should return all orders array by user", done => {
    chai
      .request(app)
      .get("/order/user")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log;
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});

//get order Items of the order

describe("/get all order_items of order by user", () => {
  it("should return error if other than seller try to get all order_items", done => {
    const sellerToken = generateToken({ user_id: 1, role: "seller" });
    chai
      .request(app)
      .get("/order/find/" + order_id)
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal("Unauthorized");
        done();
      });
  });
  it("should return all order_items array by user", done => {
    chai
      .request(app)
      .get("/order/find/" + order_id)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log;
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});
//Place order by Cart Products

describe("Place Order by cart", () => {
  before(async function () {
    const product: any = await createProduct("place Order by Cart", "place cart description", 10, 10, "Max");
    await chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product_id: product.product_id, quantity: 10 });
  });
  it("should return error if admin try to place order in cart", done => {
    chai
      .request(app)
      .post("/order/by/cart")
      .set({ Authorization: `Bearer ${AdminToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equals("Unauthorized");
        done();
      });
  });
  it("should return error if fake User to place order in cart", done => {
    const fakeToken = generateToken({ user_id: 1000, role: "both" });
    console.log(fakeToken);
    chai
      .request(app)
      .post("/order/by/cart")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equals("No user found");
        done();
      });
  });
  it("should return message if order successfully placed", done => {
    chai
      .request(app)
      .post("/order/by/cart")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equals("Order Placed Successfully");
        done();
      });
  });
});
