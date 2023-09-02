import knex from "../knex.js";

const findUserByUserName = async (userId) => {
  return knex("users")
    .select()
    .where({ id: userId })
    .limit(1)
    .then((results) => results[0]);
};

export default findUserByUserName;
