const path = require("path");
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require("dotenv").config();
const route = require('./routes');
const db = require('./config/db')
const cookie = require('cookie-parser')
//Connect to DB
db.connect();


app.use(express.static(path.join(__dirname,'/public')))

app.use(express.urlencoded({
  extended : true
}));
app.use(
  bodyParser.urlencoded({
      extended: true,
  }),
);
app.use(express.json());
app.use(morgan('combined'));
app.use(methodOverride('_method'));

app.engine('hbs', handlebars.engine({
  extname : '.hbs',
  helpers : {
    sum : (a,b) => a + b,
  }
}));
app.use(cookie())


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'resources\\views'));


//routes init
route(app)


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});