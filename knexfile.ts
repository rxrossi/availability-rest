import path from "path"
import * as Knex from "knex"

export interface KnexConfigs {
  test: Knex.Config
  remote: Knex.Config
  development: Knex.Config
}

const migrationsDir = path.join(__dirname, "/migrations")

const config: KnexConfigs = {
  test: {
    client: "postgresql",
    connection: { database: "availability-rest-test-db" },
    migrations: { directory: migrationsDir }
  },
  development: {
    client: "postgresql",
    connection: { database: "availability-rest" },
    migrations: { directory: migrationsDir }
  },
  remote: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    migrations: { directory: migrationsDir }
  }
}
export default config
module.exports = config
