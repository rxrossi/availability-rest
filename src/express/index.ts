import express from "express"
import helmet from "helmet"
import bodyParser from "body-parser"
import professionalsRouter from "../professional/router"

const server = express()

server.use(helmet())
server.use(bodyParser.json())

server.get("/", (_req, res) => {
  res.json({ name: "availability-rest" })
})

server.use("/v1/professionals", professionalsRouter)

export default server

