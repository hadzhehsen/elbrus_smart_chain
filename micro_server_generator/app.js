const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fse = require('fs-extra');
const multer = require('multer');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const mw = require('./middlewares/checkAuth');
const startCreating = require('./index');
const zip = require('express-zip');
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

let upload = multer({
  storage: multer.diskStorage({
      destination: (req, file, callback) => {
          const filePath = file.originalname.slice(0,-4).split('_')
          let path = `user_uploads/${filePath[0]}/${filePath[1]}`;
          callback(null, path);
      },
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      }
  })
});

// async function copyFiles(from, to) {
//   try {
//     await fse.copy(from, to)
//     console.log('success!')
//   } catch (err) {
//     console.error(err)
//   }
// }


// const upload = multer({ storage, dest: path.join(__dirname, 'user_uploads/') });

app.post('/upload', upload.array('layer1', 100), (req, res) => {
  // startCreating();
  // let archive = [];
  // fse.readdir('./output',(err, files) => {
  //   if(err) console.log(err);
  //   else {
  //     files.forEach((file) => {
  //     [...archive, { name: file, path: path.join(__dirname,file)}] 
  //   })}
  // })
  // res.zip(archive)
  // res.end();
});

app.post('/wallet', async (req, res) => {
  const walletString = await req.body.result;
  req.session.wallet = walletString;
  res.end();
});

app.get('/isauth', mw.checkAuth, async (req, res) => {
  req.session ? res.json(req.session.wallet) : res.status(401);
});

app.listen(PORT, () => console.log(`running on porn: ${PORT}...`));
