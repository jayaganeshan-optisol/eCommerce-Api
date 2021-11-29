import chai, { assert } from "chai";
import { describe, before } from "mocha";
import app from "../../app";
import chaiHttp from "chai-http";
import { AdminToken, token } from "./0-users.test";
import { generateToken, verifyToken } from "src/services/tokenHandling";
import { createProduct } from "src/dao/products.dao";
chai.use(chaiHttp);
let product_id: any;
let delete_product_id: any;

describe("Adding product to wishlist", () => {
  before(async function () {
    const product: any = await createProduct("wishlist Product", "wishlist Product desc", 10, 10, "Mark");
    product_id = product.product_id;
  });
  it("Should return error if admin is adding product to wishlist", done => {
    const product = { product_id: product_id };
    chai
      .request(app)
      .post("/wishlist/add")
      .set({ Authorization: `Bearer ${AdminToken}` })
      .send(product)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("Should return error if product_id is empty is adding product to wishlist", done => {
    const product = { product_id: "" };
    chai
      .request(app)
      .post("/wishlist/add")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"product_id" must be a number`);
        done();
      });
  });
  it("Should return wishlist Object on successful adding product to wishlist", done => {
    const product = { product_id: product_id };
    chai
      .request(app)
      .post("/wishlist/add")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("user_id");
        done();
      });
  });
});
//getting wishlist by user

describe("getting all products in wishlist by user", () => {
  it("should return error if admin try to get wishlist", done => {
    chai
      .request(app)
      .get("/wishlist/")
      .set({ Authorization: `Bearer ${AdminToken}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("should return products array on getting wishlist", done => {
    chai
      .request(app)
      .get("/wishlist/")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});
//remove from wishlist by product id

describe("remove Product from wishlist by product ID", () => {
  it("should return error admin try to remove wishlist item", done => {
    chai
      .request(app)
      .delete("/wishlist/remove/" + product_id)
      .set({ Authorization: `Bearer ${AdminToken}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("should return success message on removing product from  wishlist item using product ID", done => {
    chai
      .request(app)
      .delete("/wishlist/remove/" + product_id)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Removed successfully`);
        done();
      });
  });
});

describe("remove Product from wishlist by product ID", () => {
  before(async function () {
    const product: any = await createProduct("wishlist Product", "wishlist Product desc", 10, 10, "Mark");
    delete_product_id = product.product_id;
    await chai
      .request(app)
      .post("/wishlist/add")
      .set({ Authorization: `Bearer ${token}` })
      .send({ product_id: delete_product_id });
  });
  it("should return error admin try to remove wishlist item", done => {
    chai
      .request(app)
      .delete("/wishlist/remove/" + product_id)
      .set({ Authorization: `Bearer ${AdminToken}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Unauthorized`);
        done();
      });
  });
  it("should return success message on removing product from  wishlist item using product ID", done => {
    chai
      .request(app)
      .delete("/wishlist/remove")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Removed successfully`);
        done();
      });
  });
});
