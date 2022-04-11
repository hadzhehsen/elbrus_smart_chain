/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const extract = require('extract-zip');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const multer = require('multer');
const archiver = require('archiver');
const mw = require('./middlewares/checkAuth');
const start = require('./index');

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
  console.log('=>');
  const walletString = await req.body.result;
  req.session.wallet = walletString;
  res.end();
});

app.get('/isauth', mw.checkAuth, async (req, res) => {
  console.log('=>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.session);
  req.session ? res.json(req.session.wallet) : res.status(401);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, dest: path.join(process.env.PWD, 'uploads/') });

app.post('/upload', upload.single('layer1'), async (req, res) => {
  console.log(req.file);
  const { wallet } = req.session;
  console.log(wallet);
  if (req.file.filename !== 'layers.zip') res.status(403).end();
  const output = fs.createWriteStream(`${process.env.PWD}/build.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });
  async function extractor() {
    try {
      await extract('./uploads/layers.zip', { dir: `${process.env.PWD}/layers` });
    } catch (error) {
      console.log(error);
    }
  }
  await extractor();
  start();
  archive.on('error', (err) => {
    console.log(err);
    throw err;
  });
  archive.pipe(output);
  archive
    .directory('./build', false)
    .finalize();
  output.on('close', () => console.log('Pipe closed!'));
  const fileName = 'build.zip';
  const filePath = './build.zip';
  console.log(filePath, fileName);
  res.download(filePath);
});

app.listen(PORT, () => console.log(`listening on porn: ${PORT}...`));
