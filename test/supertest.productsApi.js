import chai from "chai";
import { before } from "mocha";
import supertest from "supertest";
import assert from "assert";

const expect = chai.expect;
const requester = supertest("http://localhost:8181");

//Global context of the test suite
describe("testing Products API", () => {
  before(async function () {
  this.mockUser = {
    email: "testuser@gmail.com",
    password: "123",
  };

  //user login
  this.result = await requester
  .post("/api/sessions/login")
  .send(this.mockUser);

  //extract cookie
  this.cookieCreated = this.result.header["set-cookie"][0];
  this.cookieData = this.cookieCreated.split("=");
  this.cookie = {
    name: this.cookieData[0],
    value: this.cookieData[1],
  };
  this.productTestId
});

  //Test 01 Add product
  it("Test 01 Add product", async function () {
    try {
      //Given
      this.productTest = {
        title: "Product Test",
        description: "Description product test",
        thumbnail: "product_test_thumbnail.jpg",
        price: 99.99,
        code: "testProductCode",
        stock: "99",
        category: "test"
      }
       //Then
      const response = await requester.post("/api/products").set('Cookie', [`${this.cookie.name}=${this.cookie.value}`]).send(this.productTest);

      // this will be used as id to teste the delete endpoint later
      this.productTestId = response.body.payload.product._id;

      //Assert
      expect(response.statusCode).to.be.eql(201);
      expect("Content-Type", "application/json");
      expect(response.body).has.property("payload");
      expect(response.body.payload).has.property("success").and.deep.eql(true);
    } catch (error) {
      assert.strictEqual(
        error.message,
        "El Producto no se pudo crear");
    }
  });

  //Test 02 List products
  it("Test 02 List products - returns an array", async function () {
    try {
      //then
      const response = await requester.get("/api/products")

      //Assert
      expect(response.statusCode).to.be.eql(200);
      expect("Content-Type", "application/json");
      expect(response.body).has.property("payload");
      expect(response.body.payload).has.property("success").and.deep.eql(true);
      expect(response.body.payload).has.property("productsList").that.is.an('array');
    } catch (error) {
      assert.strictEqual(
        error.message,
        "La Lista de Productos no se pudo mostrar");
    }
  });
  //Test 03 delete a product
  it("Test 03 delete a product", async function () {
    try {
      //then
      const response = await requester.delete(`/api/products/${this.productTestId}`).set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])

      //Assert
      expect(response.statusCode).to.be.eql(200);
      expect("Content-Type", "application/json");
      expect(response.body).has.property("payload");
      expect(response.body.payload).has.property("success").and.deep.eql(true);
      expect(response.body.payload).has.property("product").and.has.property("id").that.is.eql(this.productTestId);
    } catch (error) {
      assert.strictEqual(
        error.message,
        "El Producto no se pudo Borrar");
    }
  });
});