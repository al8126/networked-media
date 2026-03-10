const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});

const uploadProcessor = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let captions = [];
let currentIndex = 0;

let droodles = [
  '/images/droodle1.png',
  '/images/droodle2.png',
  '/images/droodle3.png',
  '/images/droodle4.png',
  '/images/droodle5.png',
];

app.get('/', (req, res) => {
  res.render('index', { allCaptions: captions });
});

app.get('/about', (req, res) => {
  res.render('about', { allCaptions: captions });
});

app.get('/game', (req, res) => {
  res.render('game', { allCaptions: captions });
});

app.get('/submit', (req, res) => {
  res.render('submit', { allCaptions: captions });
});

app.get('/recorded', (req, res) => {
  res.render('recorded', { allCaptions: captions });
});

app.get('/other', (req, res) => {
  currentIndex = captions.length > 0 ? captions.length - 1 : 0;
  const current = captions.length > 0 ? captions[currentIndex] : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < captions.length - 1;
  res.render('other', { allCaptions: captions, current, hasPrev, hasNext });
});

app.get('/other/next', (req, res) => {
  if (captions.length > 0 && currentIndex > 0) {
    currentIndex--;
  }
  const current = captions.length > 0 ? captions[currentIndex] : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < captions.length - 1;
  res.render('other', { allCaptions: captions, current, hasPrev, hasNext });
});

app.get('/other/prev', (req, res) => {
  if (captions.length > 0 && currentIndex < captions.length - 1) {
    currentIndex++;
  }
  const current = captions.length > 0 ? captions[currentIndex] : null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < captions.length - 1;
  res.render('other', { allCaptions: captions, current, hasPrev, hasNext });
});

app.get('/random', (req, res) => {
  const random = droodles[Math.floor(Math.random() * droodles.length)];
  res.send(random);
});

app.post('/makeCaption', (req, res) => {
  let individualCaption = {
    caption: req.body.caption,
    image: req.body.image
  };
  captions.push(individualCaption);
  console.log(individualCaption);
  res.redirect('/recorded');
});

app.post('/makeSubmit', uploadProcessor.single('myImage'), (req, res) => {
  if (req.file) {
    const imagePath = '/uploads/' + req.file.filename;
    droodles.push(imagePath);
    console.log('new droodle added:', imagePath);
    console.log('droodles:', droodles);
  }
  res.redirect('/recorded');
});

app.listen(3000, () => {
  console.log('Server running on 3000');
});