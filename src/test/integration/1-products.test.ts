import chai, { assert } from "chai";
import { describe, before } from "mocha";
import app from "../../app";
import chaiHttp from "chai-http";
import { token } from "./0-users.test";
import { generateToken, verifyToken } from "src/services/tokenHandling";
chai.use(chaiHttp);
let AdminToken: any;
let product_id: number;
let anotherSellerToken: any;
//creating a Product
describe("Creating the Product", () => {
  it("Should return error if product name is missing", done => {
    const user = { product_name: "", description: "Sample Description", unit_price: 100, number_in_stock: 79 };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"product_name" is not allowed to be empty`);
        done();
      });
  });
  it("Should return error if product description is missing", done => {
    const user = { product_name: "product 1", description: "", unit_price: 100, number_in_stock: 79 };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"description" is not allowed to be empty`);
        done();
      });
  });
  it("Should return error if unit_price  is missing", done => {
    const user = { product_name: "product 1", description: "sample description", number_in_stock: 79 };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"unit_price" is required`);
        done();
      });
  });
  it("Should return error if number_of_stock is missing", done => {
    const user = { product_name: "product 1", description: "sample description", unit_price: 100 };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"number_in_stock" is required`);
        done();
      });
  });
  it("Should return error if unit_price is of type String", done => {
    const user = { product_name: "product 1", description: "sample description", unit_price: "100", number_in_stock: 100 };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"unit_price" must be a number`);
        done();
      });
  });
  it("Should return error if number_in_stock is of type String", done => {
    const user = { product_name: "product 1", description: "sample description", unit_price: 100, number_in_stock: "100" };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"number_in_stock" must be a number`);
        done();
      });
  });
  it("Should return error if no token is provided while creating product", done => {
    const user = { product_name: "product 1", description: "sample description", unit_price: 100, number_in_stock: 100 };
    chai
      .request(app)
      .post("/product/create")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("Should return error if fake token is provided", done => {
    const user = { product_name: "product 1", description: "sample description", unit_price: 100, number_in_stock: 100 };
    const fakeToken = generateToken({ user_id: 1223232, role: "admin" });
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${fakeToken}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`User not Identified`);
        done();
      });
  });
  it("Should return product Object if valid details are given", done => {
    const user = { product_name: "product 1", description: "sample description", unit_price: 100, number_in_stock: 100 };
    chai
      .request(app)
      .post("/product/create")
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("product_id");
        res.body.should.have.property("description");
        res.body.should.have.property("unit_price");
        res.body.should.have.property("number_in_stock");
        res.body.should.have.property("seller_name");
        product_id = res.body.product_id;
        done();
      });
  });
});
//Updating the Product
describe("Update Product by ID", () => {
  before(async function () {
    await chai.request(app).post("/register").send({ name: "Mark", email: "boysxerox@gmail.com", password: "MyPassword@123", role: "seller" });
    const response = await chai.request(app).post("/login").send({ email: "boysxerox@gmail.com", password: "MyPassword@123" });
    anotherSellerToken = response.body.token;
  });
  const product = { product_name: "changed product name" };

  it("Should return error id in params in not provided", done => {
    chai
      .request(app)
      .patch("/product/update/")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Should return error id in params is string", done => {
    chai
      .request(app)
      .patch("/product/update/all")
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
  it("Should return error if No token is provided in updating Product", done => {
    chai
      .request(app)
      .patch("/product/update/" + product_id)
      .send(product)

      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("Should return error if fake token is provided in update Product", done => {
    const fakeToken = generateToken({ user_id: 1223232, role: "admin" });
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${fakeToken}` })
      .send(product)

      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`User not Identified`);
        done();
      });
  });
  it("Should return error if invalid product id is entered is provided in update Product", done => {
    chai
      .request(app)
      .patch(`/product/update/132234`)
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
  it("should return error message on product Update if other seller try to update product", done => {
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${anotherSellerToken}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Invalid seller to Update Product`);
        done();
      });
  });
  it("should return error message on product Update if product name is number", done => {
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ product_name: 1 })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"product_name" must be a string`);
        done();
      });
  });
  it("should return error message on product Update if description is number", done => {
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ description: 1 })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"description" must be a string`);
        done();
      });
  });
  it("should return error message on product Update if unit_price is string", done => {
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ unit_price: "1" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"unit_price" must be a number`);
        done();
      });
  });
  it("should return error message on product Update if number_in_stock is string", done => {
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ number_in_stock: "1" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`"number_in_stock" must be a number`);
        done();
      });
  });
  it("should return success message on successful product Update", done => {
    chai
      .request(app)
      .patch(`/product/update/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Product updated successfully`);
        done();
      });
  });
});
// all Products

describe("All Products", () => {
  it("Should return error if No token is provided in getting all Product", done => {
    chai
      .request(app)
      .get("/product/all")
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("Should return array of all products", done => {
    chai
      .request(app)
      .get("/product/all")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});
// get Product by id

describe("GET product by its ID", () => {
  it("Should return error id in params in not provided", done => {
    chai
      .request(app)
      .get("/product/")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Should return error if No token is provided in getting Product", done => {
    chai
      .request(app)
      .get("/product/" + product_id)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("should return error message if invalid product id is provided", done => {
    chai
      .request(app)
      .get(`/product/10000000`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`No such Product`);
        done();
      });
  });
  it("should return product Object", done => {
    chai
      .request(app)
      .get(`/product/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

//deleting a product
describe("Delete by Product Id", () => {
  it("Should return error id in params in not provided", done => {
    chai
      .request(app)
      .delete("/product/remove/")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Should return error id in params is string", done => {
    chai
      .request(app)
      .delete("/product/remove/all")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("Should return error if No token is provided in removing Product", done => {
    chai
      .request(app)
      .delete("/product/remove/" + product_id)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`NO token Provided`);
        done();
      });
  });
  it("Should return error if fake token is provided in removing Product", done => {
    const fakeToken = generateToken({ user_id: 1223232, role: "admin" });
    chai
      .request(app)
      .delete(`/product/remove/${product_id}`)
      .set({ Authorization: `Bearer ${fakeToken}` })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`User not Identified`);
        done();
      });
  });
  it("should return error message on product delete if other seller try to delete product", done => {
    chai
      .request(app)
      .delete(`/product/remove/${product_id}`)
      .set({ Authorization: `Bearer ${anotherSellerToken}` })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.equal(`Invalid seller to remove Product`);
        done();
      });
  });
  it("should return success message on successful product delete", done => {
    chai
      .request(app)
      .delete(`/product/remove/${product_id}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal(`Product Removed Successfully`);
        done();
      });
  });
});
