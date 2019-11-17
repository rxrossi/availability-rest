import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("availabilities", table => {
    table.increments("id").primary()

    table
      .integer("professional_id")
      .references("id")
      .inTable("professionals")
      .notNullable()

    table.integer("start").notNullable()
    table.integer("end").notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("availabilities")
}
