export function up(knex) {
  return knex.schema.createTable("notes", (table) => {
    table.increments("id");
    table.text("text");
    table.text("title");
    table.integer("user_id").notNullable();
    table.boolean("is_archive").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at");
  });
}

export function down(knex) {
  return knex.schema.dropTable("notes");
}
