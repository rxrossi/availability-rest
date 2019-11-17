import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("bookings", table => {
    table.increments("id").primary()
    table
      .integer("professional_id")
      .references("id")
      .inTable("professionals")
      .notNullable()
    table
      .integer("customer_id")
      .references("id")
      .inTable("customers")
      .notNullable()
    table.dateTime("date_time").notNullable()

    table.dateTime("created_at").notNullable()
    table.dateTime("updated_at")
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("bookings")
}
