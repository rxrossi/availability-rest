import express from "express"
import helmet from "helmet"
import bodyParser from "body-parser"
import professionalsRouter from "../professional/router"
import availabilitiesRouter from "../availability/router"
import bookingsRouter from "../booking/router"
import { isProduction } from "../environment"
import Professional from "../professional/model"
import getRequestUserMiddleware from "../authorization/getRequestUserMiddleware"
import expressErrorHandler from "../errors/expressErrorHandler"

declare module "express-serve-static-core" {
  interface Request {
    user?: Professional
  }
}

if (!isProduction()) {
  require("dotenv").config()
}

const server = express()

server.use(helmet())
server.use(bodyParser.json())

server.use(getRequestUserMiddleware)

server.get("/", (_req, res) => {
  res.json({ name: "availability-rest" })
})

server.use("/v1/professionals", professionalsRouter)

server.use("/v1/availabilities", availabilitiesRouter)

server.use("/v1/bookings", bookingsRouter)

server.use(expressErrorHandler)

export default server
