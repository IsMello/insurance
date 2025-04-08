import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await Promise.all([
        knex.schema.createTable("quotes_test_db.insurance_products", (table) => {
            table.increments("id").primary();
            table.string("name").notNullable().unique();
          }),
        
           knex.schema.createTable("quotes_test_db.rate_classes", (table) => {
            table.increments("id").primary();
            table
              .integer("insurance_product_id")
              .unsigned()
              .notNullable()
              .references("id")
              .inTable("insurance_products")
              .onDelete("CASCADE");
            table.string("rate_class").notNullable();
          }),
        
           knex.schema.createTable("quotes_test_db.rates", (table) => {
            table.increments("id").primary();
            table
              .integer("rate_class_id")
              .unsigned()
              .notNullable()
              .references("id")
              .inTable("rate_classes")
              .onDelete("CASCADE");
            table.string("coverage_period").notNullable();
            table.integer("premium").notNullable();
          })
    ])

}

export async function down(knex: Knex): Promise<void> {
    await Promise.all([
        knex.schema.dropTableIfExists("quotes_test_db.rates"),
        knex.schema.dropTableIfExists("quotes_test_db.rate_classes"),
        knex.schema.dropTableIfExists("quotes_test_db.insurance_products"),
    ])
}