import Knex from "knex"
import setupDatabase from "./setupDatabase"

export default function setupJestHooks(): void {
  let knex: Knex
  beforeAll(async () => {
    knex = await setupDatabase()
  })

  afterEach(() => truncateTables(knex))

  afterAll(async () => {
    await knex.migrate.rollback({}, true)
    await knex.destroy()
  })
}

function truncateTables(knex: Knex): Promise<any> {
  const tables = ["professionals"]

  return Promise.all(
    tables.map(table => knex.raw("truncate table " + table + " cascade"))
  )
}
