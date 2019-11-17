import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("professionals", table => {
    table
      .string("email")
      .unique()
      .alter()
  })
  await knex.schema.alterTable("customers", table => {
    table
      .string("email")
      .unique()
      .alter()
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("professionals", table => {
    table.dropUnique(["email"])
  })
  await knex.schema.alterTable("customers", table => {
    table.dropUnique(["email"])
  })
}
