import request from "supertest"
import server from "../express"
import Booking from "./model"
import setupJestHooks from "../setupJestHooks"
import Customer from "../customer/model"
import createToken from "../authorization/generateToken"
import { UserType } from "../authorization/userType"
import Professional from "../professional/model"

setupJestHooks()

describe("POST /v1/bookings", () => {
  describe("when not authenticated", () => {
    it("returns an error", async () => {
      const app = request(server)

      await app
        .post("/v1/bookings")
        .set("Accept", "application/json")
        .expect(401)

      expect(await Booking.query()).toEqual([])
    })
  })

  describe("when authenticated as professional", () => {
    it.todo("returns an error")
  })

  describe("when input is invalid", () => {
    it.todo("returns an error")
  })

  describe("when the professional is available at the requested time", () => {
    it("returns information about the booking", async () => {
      const app = request(server)

      const customer = await Customer.query().insert({
        name: "Jane Jackson",
        password: "123456",
        email: "jane.jackson@example.org"
      })

      const token = createToken({
        email: customer.email,
        userId: customer.id,
        userType: UserType.Customer
      })

      const professional = await Professional.query().upsertGraph({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org",
        availabilities: [
          {
            start: 1980, // Monday 9am
            end: 2160 // Monday 12pm
          }
        ]
      })

      await app
        .post("/v1/bookings")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          professionalId: professional.id,
          dateTime: "2019-11-18T09:30:00.000Z" // Monday 9:30
        })
        .expect(200)
        .then(response => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            professionalId: professional.id,
            dateTime: "2019-11-18T09:30:00.000Z"
          })
        })

      expect(await Booking.query()).toEqual([
        {
          id: expect.any(Number),
          customerId: customer.id,
          professionalId: professional.id,
          dateTime: new Date("2019-11-18T09:30:00.000Z"),
          createdAt: expect.any(Date),
          updatedAt: null
        }
      ])
    })
  })

  describe("when requesting with a booking time that is not a multiple of 30 minutes", () => {
    it.todo("return an error")
  })

  describe("when the professional is not available at the requested time due to his week availability", () => {
    it.todo("returns an error")
  })

  describe("when the professional is not available at the requested time due to another booking", () => {
    it("returns an error", async () => {
      const app = request(server)

      const customer = await Customer.query().insert({
        name: "Jane Jackson",
        password: "123456",
        email: "jane.jackson@example.org"
      })

      const token = createToken({
        email: customer.email,
        userId: customer.id,
        userType: UserType.Customer
      })

      const professional = await Professional.query().upsertGraph({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org",
        availabilities: [
          {
            start: 1980, // Monday 9am
            end: 2160 // Monday 12pm
          }
        ],
        bookings: [
          {
            customerId: customer.id,
            dateTime: new Date("2019-11-18T09:30:00.000Z") // Monday 9:30am
          }
        ]
      })

      await app
        .post("/v1/bookings")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          professionalId: professional.id,
          dateTime: "2019-11-18T10:00:00.000Z" // Monday 10am
        })
        .expect(422)
        .then(response => {
          expect(response.body).toEqual(
            "This booking overlaps another booking starting at Mon Nov 18 2019 09:30:00 GMT+0000 (Western European Standard Time)"
          )
        })

      expect(await Booking.query()).toHaveLength(1)
    })
  })

  describe("when booking in the past", () => {
    it.todo("throws an error")
  })
})

describe("GET /v1/bookings", () => {
  describe("when the customer does not have any bookings", () => {
    it("returns an empty array", async () => {
      const app = request(server)

      const customer = await Customer.query().insert({
        name: "Jane Jackson",
        password: "123456",
        email: "jane.jackson@example.org"
      })

      const token = createToken({
        email: customer.email,
        userId: customer.id,
        userType: UserType.Customer
      })

      await app
        .get("/v1/bookings")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .then(response => {
          expect(response.body).toEqual([])
        })
    })
  })

  describe("when the customer has a booking", () => {
    it("returns an array with the booking information", async () => {
      const app = request(server)

      const customer = await Customer.query().insert({
        name: "Jane Jackson",
        password: "123456",
        email: "jane.jackson@example.org"
      })

      //@ts-ignore
      const professional = await Professional.query().upsertGraph({
        name: "Mary Doe",
        password: "123456",
        email: "mary@example.org",
        availabilities: [
          {
            start: 1980, // Monday 9am
            end: 2160 // Monday 12pm
          }
        ],
        bookings: [
          {
            customerId: customer.id,
            dateTime: "2019-11-18T09:30:00.000Z"
          }
        ]
      })

      const token = createToken({
        email: customer.email,
        userId: customer.id,
        userType: UserType.Customer
      })

      await app
        .get("/v1/bookings")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .then(response => {
          expect(response.body).toEqual([
            {
              id: expect.any(Number),
              professional: {
                id: expect.any(Number),
                name: professional.name
              },
              dateTime: "2019-11-18T09:30:00.000Z"
            }
          ])
        })
    })
  })
})
