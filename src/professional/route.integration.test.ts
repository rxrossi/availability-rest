import request from "supertest"
import server from "../index"

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
})
