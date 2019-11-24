import request from "supertest"
import server from "../express"
import setupJestHooks from "../setupJestHooks"
import Professional from "../professional/model"
import decryptToken from "../authorization/decryptToken"
import Customer from "../customer/model"

setupJestHooks()

describe("login", () => {
  describe("when the credentials are valid and user is a professional", () => {
    it("returns the token", async () => {
      const app = request(server)

      await Professional.query().insert({
        name: "Professional 1",
        email: "professional1@example.org",
        password: "123456"
      })

      await app
        .post("/v1/login")
        .set("Accept", "application/json")
        .send({
          email: "professional1@example.org",
          password: "123456"
        })
        .then(async response => {
          expect(await decryptToken(response.body)).toMatchObject({
            email: "professional1@example.org"
          })
        })
    })
  })

  describe("when the credentials are valid and user is a customer", () => {
    it("returns the token", async () => {
      const app = request(server)

      await Customer.query().insert({
        name: "Customer 1",
        email: "customer1@example.org",
        password: "123456"
      })

      await app
        .post("/v1/login")
        .set("Accept", "application/json")
        .send({
          email: "customer1@example.org",
          password: "123456"
        })
        .then(async response => {
          expect(await decryptToken(response.body)).toMatchObject({
            email: "customer1@example.org"
          })
        })
    })
  })

  describe("when the credentials are invalid", () => {
    it("returns an error", async () => {
      const app = request(server)
      await app
        .post("/v1/login")
        .set("Accept", "application/json")
        .send({
          email: "customer1@example.org",
          password: "123456"
        })
        .then(async response => {
          expect(response.body).toEqual("Invalid credentials")
        })
    })
  })
})
