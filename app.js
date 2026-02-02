require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./modules/logger');
const sessionMiddleware = require('./middleware/session');
const socketserver = require('./modules/socketserver');
const sqlite3 = require('sqlite3');


const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  logger.info(`Created database directory: ${dbDir}`);
}

const db = new sqlite3.Database('data/Database.db', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the data/Database.db!')
    }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionMiddleware);

app.use('/', require('./routes/index'));
app.use('/', require('./routes/login'));
app.use('/profile', require('./routes/profile'));
app.use('/adopt', require('./routes/adopt'));
app.use('/api', require('./routes/api/users'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/adopt', express.static(path.join(__dirname, 'data', 'adopt')));

app.get('/adopt', (req, res) => {
  res.render('adopt', { user: req.session.user || null });
})
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'username' && password === 'password') {
    req.session.user = { username };
    return res.redirect('/profile');
  }
});

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});


socketserver.attach(server, sessionMiddleware);
