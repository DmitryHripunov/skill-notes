export function up (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.foreign("user_id").references("users.id");
    table.string("session_id").notNullable().unique();
  });
}

export function down (knex) {
  return knex.schema.dropTable("sessions");
}
