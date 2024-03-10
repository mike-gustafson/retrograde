require('dotenv').config();

const PORT = process.env.PORT;
const SECRET_SESSION = process.env.SECRET_SESSION;

const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const layouts = require('express-ejs-layouts');
const methodOverride = require('method-override')

const app = express();
const path = require('path');
const passport = require('./config/ppConfig');

app.use(layouts);
app.use(flash());
app.use(express.json());
app.use(require('morgan')('dev'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/auth', require('./controllers/auth'));
app.use('/games', require('./controllers/games'));
app.use('/profile', require('./controllers/profiles'));
app.use('/platforms', require('./controllers/platforms'));
app.use('/quotes', require('./controllers/random-quotes'));
app.use('/update', require('./controllers/updateDatabase'));

app.get('/', async (req, res) => {
  res.render('homepage');
});

const server = app.listen(PORT, () => {
  console.log(`Cartridge inserted in slot ${PORT}, insert coin to play!`);
});

module.exports = server;