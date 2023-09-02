import bodyParser from 'body-parser';
import express from 'express';
import findUserByUserName from '../services/findUserByUserName.js';
import createSession from '../services/createSession.js';
import hash from '../utils/hash.js'

const login = express.Router();

login.route('/login').post(bodyParser.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUserName(username);

    const shaPassword = hash(password);

    if (!user || user.password !== shaPassword) {
      return res.redirect('/?authError=true');
    }

    const sessionId = await createSession(user.id);

    res.status(200).cookie('sessionId', sessionId, {
      httpOnly: true,
      expires: 0,
    }).redirect('/dashboard');
  } catch (error) {
    res.status(500)
    console.error(error.message);
  }
});

export default login;
