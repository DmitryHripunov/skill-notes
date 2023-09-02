export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username", 255).notNullable().unique();
    table.string("password", 255).notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable("users");
}
