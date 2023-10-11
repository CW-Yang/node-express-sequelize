const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLogin
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/products', {
        pageTitle: 'Products',
        path: '/products',
        products,
        isAuthenticated: req.session.isLogin
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findByPk(id)
    .then(product => {
      if (product) {
        res.render('shop/product-detail', {
          pageTitle: product.title,
          path: '/products',
          product,
          isAuthenticated: req.session.isLogin
        });
      } else {
        res.redirect('/');
      }
    })
    .catch(err => {
      console.log(err);
    }); 
};

exports.getCart = (req, res, next) => {
  const userId = req.session.user.id;
  User.findOne({
    where: {
      id: userId
    }
  })
    .then(user => {
      return user.getCart();
    })
    .then(cart => {
      return cart.getProducts();
    })
    .then(items => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        items,
        isAuthenticated: req.session.isLogin
      });
    })  
    .catch(err => console.log(err));
};