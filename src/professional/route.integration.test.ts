import request from "supertest"
import server from "../express"
import Professional from "./model"
import setupJestHooks from "../setupJestHooks"

setupJestHooks()

describe("GET /v1/professional", () => {
  describe("when there are not professionals", () => {
    it("returns an empty array", async () => {
      const app = request(server)

      await app
        .get("/v1/professionals")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([])
        })
    })
  })

  describe("when there are professionals", () => {
    it("returns an array of professionals", async () => {
      const app = request(server)

      await Professional.query().insert({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org"
      })

      await app
        .get("/v1/professionals")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject([{ name: "Mary Doe" }])
        })
    })
  })
})
