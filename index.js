const path = require("path");
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require("dotenv").config();
const route = require('./src/routes');
const db = require('./src/config/db')
const cookie = require('cookie-parser')
//Connect to DB
db.connect();
import fetch from 'node-fetch';

app.use(express.static(path.join(__dirname,'/src/public')))

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
app.set('views', path.join(__dirname,'src\\resources\\views'));


//routes init
route(app)

export default async function handler(request, response) {
  const res = await fetch('https://...', {
    method: 'POST',
    body: JSON.stringify({
      DB: process.env.DB,
      PORT: process.env.PORT,
      JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
      JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
      FRONTEND_URL: process.env.FRONTEND_URL,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();
  return response.status(200).json({ data });
}

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});