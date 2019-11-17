import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("professionals", table => {
    table.dateTime("created_at").notNullable()
    table.dateTime("updated_at")
  })

  await knex.schema.alterTable("availabilities", table => {
    table.dateTime("created_at").notNullable()
    table.dateTime("updated_at")
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("professionals", table => {
    table.dropColumn("created_at")
    table.dropColumn("updated_at")
  })

  await knex.schema.alterTable("availabilities", table => {
    table.dropColumn("created_at")
    table.dropColumn("updated_at")
  })
}
