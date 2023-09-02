import * as dotenv from 'dotenv';
dotenv.config();

// npx knex migrate:make users // добавление таблицы
// npx knex migrate:latest // запуск миграции
// npx knex migrate:rollback //откатить миграции

export const client = "pg";
export const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
export const migrations = {
  tableName: "knex_migrations",
};
