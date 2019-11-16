import request from "supertest"
import server from "../express"
import setupDbHooks from "../setupJestHooks"

setupDbHooks()

describe("GET index", () => {
  it("returns an empty array", async () => {
    const app = request(server)

    await app
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          name: "availability-rest"
        })
      })
  })
})
