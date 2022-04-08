const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();

// const upload = multer({ dest: path.join(__dirname, 'uploads/') });

const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, dest: path.join(__dirname, 'uploads/') });

app.post('/upload', upload.array('layer1', 100), (req, res) => {
  console.log(req.files);
  res.end();
});

app.listen(PORT, () => {
  console.log('Server on PORT ====>', PORT);
});
