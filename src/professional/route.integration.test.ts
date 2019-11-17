import request from "supertest"
import server from "../express"
import Professional from "./model"
import setupJestHooks from "../setupJestHooks"

setupJestHooks()

describe("GET /v1/professional", () => {
  describe("when querying available professionals by a range of dates", () => {
    it("returns a list of available professionals at that time", async () => {
      const app = request(server)
      const monday9and30am = "2019-11-18T09:00:00.000Z"
      const monday12pm = "2019-11-18T12:00:00.000Z"

      await Professional.query().upsertGraph([
        {
          name: "Mary Doe",
          password: "123456",
          email: "mary@example.org",
          availabilities: [
            {
              start: 1980, // Monday 9am
              end: 2160 // Monday 12pm
            },
            {
              start: 2220, // Monday 1pm
              end: 2460 // Monday 5pm
            }
          ]
        },
        {
          name: "Annie Smith",
          password: "123456",
          email: "annie@example.org",
          availabilities: [
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
        }
      ])

      await app
        .get(
          `/v1/professionals?availableFrom=${monday9and30am}&availableTo=${monday12pm}`
        )
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([
            {
              id: expect.any(Number),
              name: "Mary Doe"
            }
          ])
        })
    })

    it.todo(
      "returns a list excluding professionals who would not be available due to having bookings"
    )
  })

  describe("when querying professionals available by date range and date range is in the past", () => {
    it.todo("throws an error")
  })

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
          expect(response.body).toEqual([
            { id: expect.any(Number), name: "Mary Doe" }
          ])
        })
    })
  })
})
