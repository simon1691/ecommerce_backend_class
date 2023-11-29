import chai from "chai";
import { before } from "mocha";
import supertest from "supertest";
import assert from "assert";

const expect = chai.expect;
const requester = supertest("http://localhost:8181");

//Global context of the test suite
describe("Testing SAP ecommerce App", () => {
  //Testing session routers with cookies (JWT)
  describe("Authencitacion and logout", () => {
    before(function () {
      this.cookie;
      this.mockUser = {
        first_name: "Test",
        last_name: "User",
        age: 18,
        email: "testuser@gmail.com",
        password: "123",
      };
    });

    //Test 01 Register user
    it("Test 01 Register user", async function () {
      try {
        //Then
        const result = await requester
          .post("/api/sessions/register")
          .send(this.mockUser);

        //Assert
        expect(result.statusCode).to.be.eq(201);
      } catch (error) {
        assert.strictEqual(
          error.message,
          "the user cant be created since this email already exists"
        );
      }
    });

    //Test 02 Login user
    it("Test 01 Login user", async function () {
      try {
        //Given
        this.mockLogin = {
          email: this.mockUser.email,
          password: this.mockUser.password,
        };

        //Then
        const result = await requester
          .post("/api/sessions/login")
          .send(this.mockLogin);

        const token = result.body.accessToken;
        const cookie = result.header["set-cookie"][0];

        //Assert
        expect(result.statusCode).to.be.eq(200);

        //Extract cookie
        const cookieData = cookie.split("=");
        this.cookie = {
          name: cookieData[0],
          value: cookieData[1],
        };
        expect(this.cookie.name).to.be.ok.and.eql("jwtCookieToken");
        expect(this.cookie).to.be.ok;
      } catch (error) {
        assert.strictEqual(error.message, "El usuario no se pudo autenticar");
      }
    });

    //Test 03 Logout user
    it("Test 03 Logout user", async function () {
      try {
        //Given
        //Then
        const result = await requester.get("/api/sessions/logout");

        //Assert
        expect(result.statusCode).to.be.eql(200);
        expect("Content-Type", "application/json");
        expect(result.body.message).to.be.eql("Se ha cerrado la sesión");
        expect(result.body.success).to.be.eql("true");
      } catch (error) {
        assert.strictEqual(
          error.message,
          "El usuario no se pudo cerrar sesión"
        );
      }
    });
  });
});
