const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./utils/database');

// setting body-parser
const parser = require('body-parser');
app.use(parser.urlencoded({ extended: false }));

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');

// setting session
const myStore = new SequelizeStore({
  db: sequelize
});
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: myStore
}));

// setting csrf protection
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// setting flash message
const flash = require('connect-flash');
app.use(flash());


myStore.sync();

const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const errorController = require('./controllers/error');



// setting static path 
app.use(express.static(path.join(__dirname, 'public')));

// setting view engine
app.set('view engine', 'pug');
app.set('views', 'views');

// data associations
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Product = require('./models/product');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// checking authencation
app.use((req, res, next) => {
  if (req.session) {
    User.findByPk(req.session?.user?.id)
      .then(user => {
        if (user) {
          req.user = user;
        }
        next();
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogin;
  res.locals.csrfToken = req.csrfToken();
  next();
});



// setting routers
app.use(shopRouter);
app.use(authRouter);
app.use('/admin', adminRouter);



// error handle
app.use(errorController.get404);



sequelize.sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })

