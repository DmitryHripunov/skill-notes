import knex from 'knex'
import * as dotenv from 'dotenv';
dotenv.config();

const dbKnex = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME1,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

export default dbKnex;
