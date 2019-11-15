import request from "supertest"
import server from "./index"

describe("index route", () => {
  it("returns json with the name of the app", async () => {
    const app = request(server)

    await app
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({
          name: "availability-api"
        })
      })
  })
})
