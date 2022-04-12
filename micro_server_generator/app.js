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

const PORT = process.env.PORT ?? 3001;

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
  console.log(req.session, '===================== SESSIYA EBAT');
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
    const date = Date.now();
    cb(null, `${date}-layers.zip`);
  },
});

const upload = multer({ storage, dest: path.join(process.env.PWD, 'uploads/') });

app.post('/upload', mw.checkAuth, upload.single('layer1'), async (req, res) => {
  const { filename } = req.file;
  console.log(req.session);
  const { wallet } = req.session;
  fs.rename(`./uploads/${filename}`, `./uploads/layers-${wallet}.zip`, () => console.log('File renamed!'));
  // if (req.file.filename !== 'layers.zip') return res.status(403).end();
  if (!fs.existsSync(`./layers-${wallet}`)) fs.mkdirSync(`./layers-${wallet}`);
  fs.readdir(`./layers-${wallet}`, (err, files) => {
    if (err) console.error(err);
    else console.log(files);
  });
  const output = fs.createWriteStream(`${process.env.PWD}/build-${wallet}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });
  async function extractor(_wallet) {
    try {
      await extract(`./uploads/layers-${_wallet}.zip`, { dir: `${process.env.PWD}/layers-${_wallet}` });
    } catch (error) {
      console.log(error);
    }
  }
  await extractor(wallet);
  start(wallet);
  if (fs.existsSync(`./uploads/layers-${wallet}.zip`)) fs.unlinkSync(`./uploads/layers-${wallet}.zip`);
  archive.on('error', (err) => {
    console.log(err);
    throw err;
  });
  archive.pipe(output);
  await archive
    .directory(`./build-${wallet}`, false)
    .finalize();
  output.on('close', () => console.log('Pipe closed!'));
  if (fs.existsSync(`./layers-${wallet}`)) fs.rmSync(`./layers-${wallet}`, { recursive: true, force: true });
  const fileName = 'NFTS.zip';
  const filePath = `./build-${wallet}.zip`;
  res.download(filePath, fileName);
  console.log(`${wallet} - DELETED BUILD DIRRECTORY`);
  if (fs.existsSync(`./build-${wallet}`)) fs.rmSync(`./build-${wallet}`, { recursive: true, force: true });
  console.log(`${wallet} - DELETED ZIP`);
  // if (fs.existsSync(filePath)) fs.unlink(filePath);
});

app.listen(PORT, () => console.log(`listening on porn: ${PORT}...`));
