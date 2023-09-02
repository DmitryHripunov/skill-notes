import dbKnex from "../knex.js";

const findUserBySessionId = async (sessionId) => {
  const session = await dbKnex("sessions")
    .select("user_id")
    .where({ session_id: sessionId })
    .limit(1)
    .then((results) => results[0]);

  if (!session) return;

  return dbKnex("users")
    .select()
    .where({ id: session.user_id })
    .limit(1)
    .then((results) => results[0]);
};

export default findUserBySessionId;
