import Knex from "knex"
import { Model } from "objection"
import { knexConfigKey } from "./environment"
import knexConfigs from "../knexfile"

export default async function setupDatabase({
  skipMigrations = false
}: {
  skipMigrations?: boolean
} = {}): Promise<Knex> {
  const knexConfig = knexConfigs[knexConfigKey()]
  const knex = Knex(knexConfig)

  if (!skipMigrations) {
    await knex.migrate.latest().catch(console.error)
  }

  Model.knex(knex)

  return knex
}
