import express from "express"
import bodyParser from "body-parser"
import helmet from "helmet"
import professionalsRouter from "./professional/router"

const app = express()
app.use(bodyParser.json())
app.use(helmet())

app.get("/", (_, res) =>
  res.json({
    name: "availability-api"
  })
)

app.use("/v1/professionals", professionalsRouter)

export default app
