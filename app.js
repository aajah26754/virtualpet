require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./modules/logger');
const sessionMiddleware = require('./middleware/session');
const socketserver = require('./modules/socketserver');
const sqlite3 = require('sqlite3');
const isAuthenticated = require('./middleware/isAuthenticated');
const inventory = require('./modules/inventory');
const { add } = require('winston');

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
app.use('/chat', require('./routes/chat'));
app.use('/adopt', require('./routes/adopt'));
app.use('/api', require('./routes/api/users'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/adopt', express.static(path.join(__dirname, 'data', 'adopt')));

app.get('/profile', isAuthenticated, async (req, res) => {
  const pets = await inventory.getInventoryForUser(req.session.user.username);

  res.render('profile', {
    user: req.session.user,
    pets
  });
});


app.get('/adopt', (req, res) => {
  res.render('adopt', { user: req.session.user || null });
})

app.post('/adopt', (req, res) => {
  const { owner, name, type } = req.body;

  if (owner && name && type) {
    const filePath = path.join(__dirname, 'data', 'adopt', `${owner}-${name}.txt`);
    fs.writeFileSync(filePath, `Owner: ${owner}\nName: ${name}\nType: ${type}`);
    logger.info(`New pet adopted: ${owner} - ${name} (${type})`);
  }

  res.redirect('/adopt');
});




app.get('/inventory', isAuthenticated,  async (req, res) => {
  const pets = await inventory.getInventoryForUser(req.session.user.username);

  res.render('inventory', {
    user: req.session.user,
    pets
  });
});

app.post('/inventory', isAuthenticated,  async (req, res) => {
  const { owner, name, type } = req.body;

  if (owner && name && type) {
    await inventory.addItemToInventory(
      req.session.user.username,
      { owner, name, type }
    );
  }

  res.redirect('/inventory');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'username' && password === 'password') {
    req.session.user = { username };
    return res.redirect('/profile');
  }
});
app.get('/chat', (req, res) => {
  res.render('chat', { user: req.session.user || null });
})

app.get('/tworld', (req, res) => {
  res.render('world', { user: req.session.user || null, loc: 'town' });
});

app.get('/dworld', (req, res) => {
  res.render('world', { user: req.session.user || null, loc: 'dump' });
});

app.get('/cworld', (req, res) => {
  res.render('world', { user: req.session.user || null, loc: 'city' });
});

app.get('/dump', (req, res) => {
  res.render('dump', { user: req.session.user || null });
});

app.post('/profile', async (req, res) => {
  const { owner, name, type, type2 } = req.body;

  if (owner && name && type && type2) {
    if (type2 === 'add') {
      await inventory.addItemToInventory(
        req.session.user.username,
        { owner, name, type }
      );
    } else if (type2 === 'remove') {
      await inventory.removeItemFromInventory(
        req.session.user.username,
        name
      );
    }
  }

  res.redirect('/profile');
});

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});


socketserver.attach(server, sessionMiddleware);
