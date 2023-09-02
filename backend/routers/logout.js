import express from 'express';
const logout = express.Router();

import auth from '../middleware/auth.js';
import  deleteSession from '../services/deleteSession.js';

logout.route('/logout').get(auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    await deleteSession(req.sessionId);

    res.status(200).clearCookie('sessionId').redirect('/');
  } catch (err) {
    res.status(500)
    console.error(err);
  }
});

export default logout;
