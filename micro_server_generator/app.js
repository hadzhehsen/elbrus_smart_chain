/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
const express = require('express');
const path = require('path');
const fs = require('fs');
const { readDirDeep, readDirDeepSync } = require('read-dir-deep');
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
    cookie: { secure: false, maxAge: 0 },
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

const upload = multer({
  storage,
  dest: path.join(process.env.PWD, 'uploads/'),
});

app.post('/upload', mw.checkAuth, upload.single('layer1'), async (req, res, next) => {
  const { filename } = req.file;
  const { wallet } = req.session;
  // ----------------------------------------------------------- //
  fs.rename(`./uploads/${filename}`, `./uploads/layers-${wallet}.zip`, () => console.log('File renamed!')); // rename script for user archive
  if (!fs.existsSync(`./layers-${wallet}`)) {
    fs.mkdirSync(`./layers-${wallet}`);
    console.log(`${wallet} - DIRECTORY 'layers-${wallet}' CREATED`);
  }
  // ----------------------------------------------------------- //
  const output = fs.createWriteStream(`${process.env.PWD}/build-${wallet}.zip`);
  const archive = archiver('zip', {
    zlib: { level: -1 }, // Sets the compression level.
  });
  // ----------------------------------------------------------- //
  async function extractor(_wallet) {
    try {
      await extract(`./uploads/layers-${_wallet}.zip`, {
        dir: `${process.env.PWD}/layers-${_wallet}`,
      });
      console.log(`${wallet} - FILES EXTRACTED`);
    } catch (error) {
      console.log(error);
    }
  }
  await extractor(wallet); // Extraction script initialised.
  const dirrectoryContents = await readDirDeep(`${process.env.PWD}/layers-${wallet}`);
  const regularExpression = /(\/layer\d{1,7})\b[\s\S]*(?:#\d{2}.png)$/gm;
  console.log(dirrectoryContents, '- LAYERS CONTENTS');
  console.log(`${process.env.PWD}/layers-${wallet} ========================== KEK`);
  dirrectoryContents.forEach((el) => {
    // console.log(el);
    if (!regularExpression.test(el)) {
      console.log('WRONG ELEMENT -', el);
      if (fs.existsSync(`./layers-${wallet}`)) {
        fs.rmSync(`./layers-${wallet}`, { recursive: true, force: true });
        console.log(`${wallet} - DELETED LAYERS DIRRECTORY`);
      }
      if (fs.existsSync(`./build-${wallet}.zip`)) {
        fs.unlink(`./build-${wallet}.zip`, () => console.log(`${wallet} - BUILT ARCHIVE WAS DELETED!`));
      }
      return res.end();
    }
    next();
  });
  // ----------------------------------------------------------- //
  if (fs.existsSync(`./uploads/layers-${wallet}.zip`)) {
    fs.unlinkSync(`./uploads/layers-${wallet}.zip`);
    console.log(`${wallet} - 'layers.zip' ARCHIVE DELETED`);
  }
  // ----------------------------------------------------------- //
  await start(wallet); // Main script initialisation.
  // ----------------------------------------------------------- //
  archive.on('error', (err) => { // Archiver error check.
    console.log(err);
    throw err;
  });
  const fileName = `build-${wallet}.zip`; // Final zip name.
  const filePath = `./build-${wallet}.zip`; // Final zip path.
  archive.pipe(output);
  console.log(`${wallet} - ARCHIVER PIPE OPENED`);
  await archive
    .directory(`./build-${wallet}`, false) // Makes a zip out of users build dir.
    .finalize(); // Finalize zip.
  // -----------------------------------------------------------//
  output.on('close', () => {
    console.log(`${wallet} - ARCHIVER PIPE CLOSED`);

    if (fs.existsSync(`./layers-${wallet}`)) {
      fs.rmSync(`./layers-${wallet}`, { recursive: true, force: true });
      console.log(`${wallet} - DELETED LAYERS DIRRECTORY`);
    }

    if (fs.existsSync(`./build-${wallet}`)) {
      fs.rmSync(`./build-${wallet}`, { recursive: true, force: true });
      console.log(`${wallet} - DELETED BUILD DIRRECTORY`);
    }

    console.log(`${wallet} - FILES SENT`);
    return res.download(filePath, fileName, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
      fs.unlink(`./build-${wallet}.zip`, () => console.log(`${wallet} - BUILT ARCHIVE WAS DELETED!`));
    });
  });
});

app.listen(PORT, () => console.log(`listening on porn: ${PORT}...`));
