import express from 'express';
import auth from '../middleware/auth.js';

const main = express.Router();

main.route('/').get(auth, (req, res) => {
  try {
    if (req.user) return res.redirect('/dashboard');

    return res.status(200)
      .render('index', {
        user: req.user,
        authError: req.query.authError === 'true' ? 'Wrong username or password' : req.query.authError,
        signError: req.query.signError === 'true' ? 'User is exist try Login' : req.query.signError,
      });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

export default main;
