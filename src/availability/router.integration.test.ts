import request from "supertest"
import server from "../express"
import setupJestHooks from "../setupJestHooks"
import Professional from "../professional/model"
import createToken from "../authorization/generateToken"
import { UserType } from "../authorization/userType"
import Availability from "./model"

setupJestHooks()

describe("PUT /v1/availabilities", () => {
  describe("when authorized and sending valid data in valid format", () => {
    it("returns the updated availabilities and store in database", async () => {
      const app = request(server)

      const professional = await Professional.query().upsertGraph({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org",
        availabilities: [
          {
            start: 1980,
            end: 2160
          }
        ]
      })

      const token = createToken({
        email: professional.email,
        userType: UserType.Professional,
        userId: professional.id
      })

      await app
        .put("/v1/availabilities")
        .set("Authorization", `Bearer ${token}`)
        .send([
          {
            start: 1980,
            end: 2160
          },
          {
            start: 2220,
            end: 2460
          }
        ])
        .set("Accept", "application/json")
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([
            { start: 1980, end: 2160 },
            { start: 2220, end: 2460 }
          ])
        })

      expect(await Availability.query()).toEqual([
        {
          start: 1980,
          end: 2160,
          professionalId: professional.id,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: null
        },
        {
          start: 2220,
          end: 2460,
          professionalId: professional.id,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: null
        }
      ])
    })
  })

  describe("when unauthenticated", () => {
    it("returns an 401", async () => {
      const app = request(server)

      await app
        .put("/v1/availabilities")
        .set("Accept", "application/json")
        .expect(401)
    })
  })

  describe("when sending data in invalid format", () => {
    it("returns a 422", async () => {
      const app = request(server)

      const professional = await Professional.query().upsertGraph({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org",
        availabilities: [
          {
            start: 1980,
            end: 2160
          }
        ]
      })

      const token = createToken({
        email: professional.email,
        userType: UserType.Professional,
        userId: professional.id
      })

      await app
        .put("/v1/availabilities")
        .set("Authorization", `Bearer ${token}`)
        .send({
          start: 1980,
          end: 2160
        })
        .set("Accept", "application/json")
        .expect(422)
        .then(response => {
          expect(response.body).toMatchObject({
            details: [
              {
                message: '"value" must be an array'
              }
            ]
          })
        })
    })
  })
})

describe("GET /v1/availabilities/", () => {
  describe("when requesting unauthenticated", () => {
    it("returns an 401", async () => {
      const app = request(server)

      await app
        .get("/v1/availabilities")
        .set("Accept", "application/json")
        .expect(401)
    })
  })

  describe("when the authenticated professional has availabilities", () => {
    it("returns an empty array", async () => {
      const app = request(server)

      const professional = await Professional.query().upsertGraph({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org",
        availabilities: [
          {
            start: 1980,
            end: 2160
          }
        ]
      })

      await Professional.query().upsertGraph({
        name: "Annie Smith",
        password: "123456",
        email: "annie@example.org",
        availabilities: [
          {
            start: 10,
            end: 20
          }
        ]
      })

      const token = createToken({
        email: professional.email,
        userType: UserType.Professional,
        userId: professional.id
      })

      await app
        .get("/v1/availabilities")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual([
            {
              start: 1980,
              end: 2160
            }
          ])
        })
    })
  })
})
