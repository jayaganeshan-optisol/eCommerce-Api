import chai, { assert } from "chai";
import { describe, before } from "mocha";
import app from "../../app";
import chaiHttp from "chai-http";
import { token } from "./0-users.test";
import { generateToken, verifyToken } from "src/services/tokenHandling";
import { createProduct } from "src/dao/products.dao";
chai.use(chaiHttp);
let product_id: any;
let delete_product_id: any;
describe("Adding product to cart", () => {
  before(async function () {
    const product: any = await createProduct("cart Product", "cart Product desc", 10, 10, "alex");
    product_id = product.product_id;
  });
  it("Should return error if seller is adding product to cart", done => {
    const product = { product_id: product_id, quantity: 1 };
    let fakeToken = generateToken({ user_id: 10000000, role: "seller" });
    chai
      .request(app)
      .post("/cart/")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("Should return error if product_id is missing", done => {
    const product = { quantity: 10 };
    chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"product_id" is required`);
        done();
      });
  });
  it("Should return error if quantity is missing", done => {
    const product = { product_id: product_id };
    chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"quantity" is required`);
        done();
      });
  });
  it("Should return error if product_id is invalid", done => {
    const product = { product_id: 10000000, quantity: 1 };
    chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`No product available`);
        done();
      });
  });
  it("Should return cart Object if successfully placed", done => {
    const product = { product_id: product_id, quantity: 1 };
    chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("product_id");
        done();
      });
  });
  it("Should return successfully updated message", done => {
    const product = { product_id: product_id, quantity: 2 };
    chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal("Updated successfully");
        done();
      });
  });
});
//Viewing the user's cart

describe("viewing cart", () => {
  it("Should return error if seller is get the cart", done => {
    let fakeToken = generateToken({ user_id: 10000000, role: "seller" });
    chai
      .request(app)
      .get("/cart/view")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("Should return cart products in array ", done => {
    chai
      .request(app)
      .get("/cart/view")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});
// updating the cart

describe("Updating the quantity of product to cart", () => {
  before(async function () {
    const product: any = await createProduct("delete cart Product ", "delete cart Product desc", 10, 10, "alex");
    delete_product_id = product.product_id;
  });
  it("Should return error if seller is updating product to cart", done => {
    const product = { product_id: product_id, quantity: 1 };
    let fakeToken = generateToken({ user_id: 10000000, role: "seller" });
    chai
      .request(app)
      .patch("/cart/update")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("Should return error if product_id is missing while updating cart", done => {
    const product = { quantity: 10 };
    chai
      .request(app)
      .patch("/cart/update")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"product_id" is required`);
        done();
      });
  });
  it("Should return error if quantity is missing while updating cart", done => {
    const product = { product_id: product_id };
    chai
      .request(app)
      .patch("/cart/update")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"quantity" is required`);
        done();
      });
  });
  it("Should return error if product_id is invalid while updating cart", done => {
    const product = { product_id: 10000000, quantity: 1 };
    chai
      .request(app)
      .patch("/cart/update")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`No product available`);
        done();
      });
  });
  it("Should return updated message", done => {
    const product = { product_id: product_id, quantity: 2 };
    chai
      .request(app)
      .patch("/cart/update")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal("Updated successfully");
        done();
      });
  });
});

//Deleting products from cart

describe("Deleting the Product by its ID in cart by user", () => {
  before(async function () {
    const product: any = await createProduct("delete cart Product ", "delete cart Product desc", 10, 10, "alex");
    delete_product_id = product.product_id;
    await chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product_id: delete_product_id, quantity: 10 });
  });
  it("Should return error if seller is deleting product to cart", done => {
    let fakeToken = generateToken({ user_id: 10000000, role: "seller" });
    chai
      .request(app)
      .delete("/cart/delete/" + delete_product_id)
      .set({ Authorization: `Bearer ${fakeToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("Should return error if product_id is missing in params cart", done => {
    chai
      .request(app)
      .delete("/cart/delete/")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Should return error if invalid product id is provided in deleting product form cart", done => {
    chai
      .request(app)
      .delete("/cart/delete/1000000")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`No product Available`);
        done();
      });
  });
  it("Should return success message if product in deleting product", done => {
    chai
      .request(app)
      .delete("/cart/delete/" + delete_product_id)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Product removed successfully`);
        done();
      });
  });
});

//deleting all products in cart by user

describe("Deleting all Products by User", () => {
  before(async function () {
    const product_1: any = await createProduct("delete cart Product1 ", "delete cart Product desc 1", 10, 10, "alex");
    const product_2: any = await createProduct("delete cart Product 2", "delete cart Product desc 2", 10, 10, "Ralph");
    await chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product_id: product_1.product_id, quantity: 10 });
    await chai
      .request(app)
      .post("/cart")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product_id: product_2.product_id, quantity: 10 });
  });
  it("Should return error if seller is deleting all product in cart", done => {
    let fakeToken = generateToken({ user_id: 10000000, role: "seller" });
    chai
      .request(app)
      .delete("/cart/all/delete")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("Should return success message if Product removed in deleting all product", done => {
    chai
      .request(app)
      .delete("/cart/all/delete")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Removed successfully`);
        done();
      });
  });
  it("Should return error message if no Product removed in deleting all product", done => {
    chai
      .request(app)
      .delete("/cart/all/delete")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`No Products to Remove`);
        done();
      });
  });
});
