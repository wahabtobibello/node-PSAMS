const supertest = require("supertest");
const cheerio = require("cheerio");
// const app = require("../src/app");

describe("register route", () => {
  const request = supertest.agent("http://localhost:3000");
  let csrfValue;
  test("It should response the GET method", () => {
    return request.get("/register")
      .then(response => {
        const $ = cheerio.load(response.text);
        csrfValue = $("input[name='_csrf']").val();
        expect(response.statusCode).toBe(200);
        expect(response.get("Set-Cookie")).toBeTruthy();
      });
  });

  test("It should response the POST method", () => {
    return request.post("/register")
      .send({
        firstName: "Tobi",
        lastName: "Bello",
        matricNumber: 130805001,
        password: "nutella",
        confirmPassword: "nutella",
        _csrf: csrfValue
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.redirect).toBeTruthy();

      });
  });

  // test("It should response the GET method", () => {
  //   return request.get("/login").then(response => {
  //     // for (let key in response) {
  //     //   console.log(key);
  //     // }
  //     const $ = cheerio.load(response.text);
  //     console.log($("input[name='_csrf']").val());
  //     expect(response.statusCode).toBe(200);
  //   });
  // });
});