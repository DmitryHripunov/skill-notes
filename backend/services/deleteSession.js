import knex from '../knex.js';

const deleteSession = async (sessionId) => {
  await knex("sessions").where({ session_id: sessionId }).delete();
};

export default deleteSession;
