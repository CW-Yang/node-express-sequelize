const express = require('express');
const path = require('path');
const app = express();

// setting body-parser
const parser = require('body-parser');
app.use(parser.urlencoded({ extended: false }));

// setting static path 
app.use(express.static(path.join(__dirname, 'public')));

// setting view engine
app.use('view engine', 'pug');
app.use('views', 'views');

app.use((req, res, next) => {
  res.send('Hello From ExpressJS');
});

app.listen(3000);