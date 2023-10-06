const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('index', {
        products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    })
};