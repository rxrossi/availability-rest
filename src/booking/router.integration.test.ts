import request from "supertest"
import server from "../express"
import Booking from "./model"
import setupJestHooks from "../setupJestHooks"

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

  describe("when the professional is available at the requested time", () => {
    it.todo("returns information about the booking")
  })

  describe("when requesting with a booking time that is not a multiple of 30 minutes", () => {
    it.todo("return an error")
  })

  describe("when the professional is not available at the requested time due to his week availability", () => {
    it.todo("returns an error")
  })

  describe("when the professional is not available at the requested time due to another booking", () => {
    it.todo("returns an error")
  })
})

describe("GET /v1/bookings", () => {
  describe("when the customer does not have any bookings", () => {
    it.todo("returns an empty array")
  })

  describe("when the customer has a booking", () => {
    it.todo("returns an array with the booking information")
  })
})
