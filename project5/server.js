const express = require('express');
const app = express();
const passwords = {
  a: 'sam',
  b: 'password_b',
  c: 'password_c',
  d: 'password_d'
};

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/authenticate_a', (req, res) => {
  res.render('authenticate_a');
});

app.post('/authenticate_a', (req, res) => {
              console.log('entered:', req.body.password);
  console.log('expected:', passwords.a);
  if (req.body.password === passwords.a) {
    res.redirect('/game');
  } else {
    res.redirect('/authenticate_a');
  }
});

app.get('/game', (req, res) => {
  res.render('game');
});

app.post('/submit', (req, res) => {
  console.log(req.body);
  res.redirect('/game');
});

app.get('/finish', (req, res) => {
  res.render('finish');
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});