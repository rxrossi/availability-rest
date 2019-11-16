import request from "supertest"
import server from "../express"
import setupDbHooks from "../setupJestHooks"
import Professional from "../professional/model"

setupDbHooks()

describe("GET /v1/availabilities/", () => {
  describe("when the authenticated professional has availabilities", () => {
    it("returns an empty array", async () => {
      const app = request(server)

      await Professional.query().upsertGraph({
        name: "Mary Doe",
        availabilities: [
          {
            start: 1980, // Monday 9am
            end: 2160 // Monday 12pm
          },
          {
            start: 2220, // Monday 1pm
            end: 2460 // Monday 5pm
          },
          {
            start: 3420, // Tuesday 9am
            end: 3600 // Tuesday 12pm
          },
          {
            start: 3660, // Tuesday 1pm
            end: 3900 // Tuesday 5pm
          },
          {
            start: 4860, // Wednesday 9am
            end: 5040 // Wednesday 12pm
          },
          {
            start: 5100, // Wednesday 1pm
            end: 5340 // Wednesday 5pm
          }
        ]
      })

      await app
        .get("/v1/availabilities")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([
            {
              start: 1980,
              end: 2160
            },
            {
              start: 2220,
              end: 2460
            },
            {
              start: 3420,
              end: 3600
            },
            {
              start: 3660,
              end: 3900
            },
            {
              start: 4860,
              end: 5040
            },
            {
              start: 5100,
              end: 5340
            }
          ])
        })
    })
  })
})
