import chai from "chai";
import { before } from "mocha";
import supertest from "supertest";
import assert from "assert";

const expect = chai.expect;
const requester = supertest("http://localhost:8181");

//Global context of the test suite
describe("testing Carts API", () => {
  before(async function () {
  //this is the user that will be logged in to test
  //the protected routes
  this.mockUser = {
    email: "sadmin@gmail.com",
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
  // Remember delete this product from the DB each time you test
  // This to avoid error of product already exists
  this.productTest = {
    title: "Product Test",
    description: "Description product test",
    thumbnail: "product_test_thumbnail.jpg",
    price: 99.99,
    code: "testProductAddToCart",
    stock: "99",
    category: "test"
  }
  this.productCreated = await requester.post("/api/products").set('Cookie', [`${this.cookie.name}=${this.cookie.value}`]).send(this.productTest);

  this.productTestId = this.productCreated.body.payload.product._id;

  this.cartTestId
  
});

  //Test 01 Add a Cart
  it("Test 01 Add a Cart", async function () {
    try {

       //Then
      const response = await requester.post("/api/carts")

      // this will be used as id to test the delete endpoint later
      this.cartTestId = response.body.payload.cartAdded._id;

      //Assert
      expect(response.statusCode).to.be.eql(201);
      expect("Content-Type", "application/json");
      expect(response.body).has.property("payload");

      expect(response.body.payload)
      .has.property("success")
      .and.deep.eql(true);

      expect(response.body.payload)
      .has.property("cartAdded")
      .has.property("_id")
      .and.deep.eql(this.cartTestId);

    } catch (error) {
      assert.strictEqual(
        error.message,
        "El Carrito no se pudo crear");
    }
  });

  //Test 02 Add products to the cart
  it("Test 02 Add products to the cart", async function () {
    try {
      //Given
      this.mockUser = {
        email: "suser@gmail.com",
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
      //then
      const response = await requester.post(`/api/carts/${this.cartTestId}/product/${this.productTestId}`).set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])

      //Assert
      expect(response.statusCode).to.be.eql(200);
      expect("Content-Type", "application/json");
      expect(response.body).has.property("payload");
      expect(response.body.payload).has.property("success").and.deep.eql(true);
      expect(response.body.payload).has.property("productId").and.deep.eql(this.productTestId);
      expect(response.body.payload).has.property("cartId").and.deep.eql(this.cartTestId);
    } catch (error) {
      assert.strictEqual(
        error.message,
        "El producto no se pudo Agregar al Carrito");
    }
  });
  //Test 03 delete a product in cart
  it("Test 03 delete a product in a cart", async function () {
    try {
      //then
      const response = await requester.delete(`/api/carts/${this.cartTestId}/product/${this.productTestId}`).set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])

      //Assert
      expect(response.statusCode).to.be.eql(200);
      expect("Content-Type", "application/json");
      expect(response.body).has.property("payload");
      expect(response.body.payload).has.property("success").and.deep.eql(true);
      expect(response.body.payload).has.property("productId").and.deep.eql(this.productTestId);
      expect(response.body.payload).has.property("cartId").and.deep.eql(this.cartTestId);
    } catch (error) {
      assert.strictEqual(
        error.message,
        "El Producto no se pudo Borrar");
    }
  });
    //Test 04 list carts
    it("Test 03 delete a product in a cart", async function () {
      try {
        //then
        const response = await requester.get('/api/carts/')
  
        //Assert
        expect(response.statusCode).to.be.eql(200);
        expect("Content-Type", "application/json");
        expect(response.body)
        .has.property("payload")
        .that.is.an('array');

      } catch (error) {
        assert.strictEqual(
          error.message,
          "La lista de los carritos no se pudo mostrar");
      }
    });
//Test 05 delete a cart
it("Test 05 delete a cart", async function () {
  try {
    //then
    const response = await requester.delete(`/api/carts/${this.cartTestId}/`)

    //Assert
    expect(response.statusCode).to.be.eql(200);
    expect("Content-Type", "application/json");
    expect(response.body).has.property("payload")
    .has.property("success").and.deep.eql(true)
    expect(response.body).has.property("payload")
    .has.property("cartId").and.deep.eql(this.cartTestId);

  } catch (error) {
    assert.strictEqual(
      error.message,
      "La lista de los carritos no se pudo mostrar");
  }
});
});