import knex from "../knex.js";

const findUserByUserName = async (username) => {
  return knex("users")
    .select()
    .where({ username })
    .limit(1)
    .then((results) => results[0]);
};

export default findUserByUserName;
