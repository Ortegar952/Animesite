const express = require('express');
const expressLayouts = require('express-ejs-layouts');
// const mustacheExpress = require('mustache-express');
const port    = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser     = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app     = express();

//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log('Encounter the folllwing error ', err));

// app.engine('html', mustacheExpress());

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express Session
app.use(session({
  secret: 'beans',
  resave: true,
  saveUninitialized: true,
}))

//passpport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_smg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
    next();
  });

//set up routes
app.use('/', require('./routes/index'))
app.use('/users',require('./routes/users'));


app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



app.listen(port, () => {
  console.log(`Server started on ${port}`)
});
