import express from 'express';
import auth from '../middleware/auth.js';

const dashboard = express.Router();

dashboard.route('/dashboard').get(auth, async (req, res) => {
  if (!req.user) return res.redirect('/');

  try {
    const username = await req.user.username;

    return res.status(200).render('dashboard', { username });
  } catch(error) {
    res.status(500)
    console.log(error);
  }
});

export default dashboard;
