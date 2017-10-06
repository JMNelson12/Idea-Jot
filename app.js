// ----- Express
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
// ----- Handlebars
const exphbs = require('express-handlebars');
// ----- Mongoose
const mongoose = require('mongoose');
// ----- Body Parser
const bodyParser = require('body-parser');
// ----- Passport
const passport = require('passport');
// ----- Method Override
const methodOverride = require('method-override')
// ----- Connect Flash
const flash = require('connect-flash');
// ----- Express Session
const session = require('express-session');
// ----- Path
const path = require('path');

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database'); 

// Map Global promise - get rid of warning
mongoose.Promise = global.Promise;
					  
mongoose.connect(db.mongoURI, {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err));

/* Handlebars Middleware */
app.engine('handlebars', exphbs({
  defaultLayout: 'master'
}));
app.set('view engine', 'handlebars');

/* Body Parser Middleware */
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

/* Path Middleware */
app.use(express.static(path.join(__dirname, 'public')));

/* Method Override Middleware */
app.use(methodOverride('_method'));

/* Express Session Middleware */
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

/* Passport Middleware !imporant to be after express session */
app.use(passport.initialize());
app.use(passport.session());

/* Connect Flash Middleware */
app.use(flash());

// Global Vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route ----------
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route ----------
app.get('/about', (req, res) => {
  res.render('about');
});

// Ideas and Users Routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Starting on port ${port}`);
});