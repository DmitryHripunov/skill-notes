import express from 'express';
const signup = express.Router();

import bodyParser from 'body-parser';
import hash from '../utils/hash.js';

import knex from '../knex.js';

signup.route('/signup').post(bodyParser.urlencoded({ extended: false }), async (req, res) => {
  try {
    const userName = req.body.username;
    const userPassword = hash(req.body.password);

    const findingUser = await knex.raw(
      `
        SELECT username, password FROM users
        WHERE username='${userName}' AND password='${userPassword}'
      `
    );
    if (findingUser.rows[0]) {
      return res.redirect('/?signError=true');
    } else {
      await knex.table('users').insert({
        username: userName,
        password: userPassword,
      });

      return res.redirect('/');
    }
  } catch (err) {
    console.log(err.message);
  }
});

export default signup;
