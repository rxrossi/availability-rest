import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("customers", table => {
    table.increments("id").primary()
    table.string("name").notNullable()
    table.string("password").notNullable()
    table.string("email").notNullable()
    table.dateTime("created_at").notNullable()
    table.dateTime("updated_at")
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("customers")
}
