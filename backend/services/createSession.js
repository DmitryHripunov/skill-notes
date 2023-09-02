import knex from "../knex.js";
import { nanoid } from 'nanoid'

export const createSession = async (userId) => {
  const sessionId = nanoid();

  await knex("sessions").insert({
    user_id: userId,
    session_id: sessionId,
  });

  return sessionId;
};

export default createSession;
