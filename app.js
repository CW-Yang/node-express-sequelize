const express = require('express');
const path = require('path');
const app = express();

const shopRouter = require('./routes/shop');

const errorController = require('./controllers/error');

// setting body-parser
const parser = require('body-parser');
app.use(parser.urlencoded({ extended: false }));

// setting static path 
app.use(express.static(path.join(__dirname, 'public')));

// setting view engine
app.set('view engine', 'pug');
app.set('views', 'views');

// setting routers
app.use(shopRouter);

// error handle
app.use(errorController.get404);

app.listen(3000);