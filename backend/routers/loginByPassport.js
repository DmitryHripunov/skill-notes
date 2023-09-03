import express from 'express';
import createSession from '../services/createSession.js';
import findUserByUserId from '../services/findUserByUserId.js';
import knex from '../knex.js';
import hash from '../utils/hash.js'
import { nanoid } from 'nanoid';
import passport from 'passport';
import passportGithub from 'passport-github';
// import passportGoogle from 'passport-google-oauth2';

const GitHubStrategy = passportGithub.Strategy;
// const GoogleStrategy = passportGoogle.Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
}, async (accessToken, refreshToken, profile, done) => {
  const user = await findUserByUserId(profile.id);

  if (!user) {
    const password = hash(nanoid());
    await knex.table('users').insert({
      username: profile.username,
      password: password,
      id: profile.id
    });

    const user = {
      name: profile.username,
      id: profile.id
    }

    return done(null, user);
  }

  return done(null, user);
}
));

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: "/auth/google/callback",
//   passReqToCallback: true
// },

// ));

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user);
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user)
  })
});

const loginByPassport = express.Router();

loginByPassport.route('/auth/github').get(passport.authenticate('github'));
loginByPassport.route('/auth/github/callback').get(passport.authenticate('github', {
  session: false
}), async (req, res) => {
  const sessionId = await createSession(req.user.id);

  res.status(200).cookie('sessionId', sessionId, {
    httpOnly: true,
    expires: 0,
  }).redirect('/dashboard');
});

export default loginByPassport;
