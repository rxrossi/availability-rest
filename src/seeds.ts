import Professional from "./professional/model"
import Customer from "./customer/model"
import setupDatabase from "./setupDatabase"
import { isProduction } from "./environment"

if (!isProduction()) {
  require("dotenv").config()
}

setupDatabase({ skipMigrations: true })
  .then(seeds)
  .then(() => process.exit())

async function seeds(): Promise<void> {
  await Professional.query().upsertGraph(
    [
      {
        id: 1,
        name: "Professional 1",
        email: "professional1@example.com",
        password: "123456"
      },
      {
        id: 2,
        name: "Professional 2",
        email: "professional2@example.com",
        password: "123456",
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
      }
    ],
    {
      insertMissing: true
    }
  )

  await Customer.query().upsertGraph(
    [
      {
        id: 1,
        name: "Customer 1",
        email: "customer1@example.com",
        password: "123456"
      },
      {
        id: 2,
        name: "Customer 2",
        email: "customer2@example.com",
        password: "123456"
      }
    ],
    {
      insertMissing: true
    }
  )
}
