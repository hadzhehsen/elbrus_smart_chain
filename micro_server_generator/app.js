const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const mw = require('./middlewares/checkAuth');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT ?? 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(
  session({
    name: 'userCookie',
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
    cookie: { secure: false, maxAge: 60 * 60 * 1000 },
  }),
);

app.use((err, req, res, next) => {
  if (err) {
    const fakeErrObject = { name: err.name, message: err.message };
    if (err.stack) fakeErrObject.stack = err.stack;
    fakeErrObject.asString = err.toString();
    res.status(500).json(fakeErrObject);
  } else {
    next();
  }
});

app.post('/wallet', async (req, res) => {
  const walletString = await req.body.result;
  req.session.wallet = walletString;
  res.end();
});

app.get('/isauth', mw.checkAuth, async (req, res) => {
  req.session ? res.json(req.session.wallet) : res.status(401);
});

app.listen(PORT, () => console.log(`listening ${PORT}...`));
