import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("professionals", table => {
    table.string("email").notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("professionals", table => {
    table.dropColumn("email")
  })
}
