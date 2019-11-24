import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("availabilities", table => {
    table.index("id")
    table.index("professional_id")
    table.index("start")
    table.index("end")
  })

  await knex.schema.alterTable("bookings", table => {
    table.index("id")
    table.index("professional_id")
    table.index("customer_id")
    table.index("date_time")
  })
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("availabilities", table => {
    table.dropIndex("id")
    table.dropIndex("professional_id")
    table.dropIndex("start")
    table.dropIndex("end")
  })

  await knex.schema.alterTable("bookings", table => {
    table.dropIndex("id")
    table.dropIndex("professional_id")
    table.dropIndex("customer_id")
    table.dropIndex("date_time")
  })
}
