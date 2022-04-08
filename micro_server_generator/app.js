const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
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
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000, httpOnly: true },
    name: 'userCookie',
    store: new FileStore(),
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
  const walletString = await req.body.join('');
  req.session.wallet = walletString;
  console.log(req.session);
});

app.listen(PORT, () => console.log(`listening ${PORT}...`));
