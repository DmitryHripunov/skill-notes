import * as dotenv from 'dotenv';
dotenv.config();

import http from 'node:http';
import express from 'express';
import nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';

import main from './backend/routers/main.js';
import dashboard from './backend/routers/dashboard.js';
import signup from './backend/routers/signup.js';
import login from './backend/routers/login.js';
// import loginByPassport from './backend/routers/loginByPassport.js';
import logout from './backend/routers/logout.js';

import notes from './backend/api/notes.js';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// app.use('/', [
//   main,
//   login,
//   // loginByPassport,
//   logout,
//   signup,
//   dashboard,
//   notes,
// ]);

app.use('/', (req, res) => {
  try {
    res.status(200).render('views/index.njk');
  } catch(error) {
    res.send(error)
  }
});

// app.all('*', (req, res) => {
//   try {
//     res.status(404).send('<h1>404! Page not found</h1>');
//   } catch(error) {
//     res.send(error)
//   }
// });

const server = http.createServer(app);

const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
