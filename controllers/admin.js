const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    isAuthenticated: req.session.isLogin
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.create({
    title,
    imageUrl,
    price,
    description
  })
    .then(result => {
      console.log('CREATE PRODUCT');
      return res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLogin
      });
    })
    .catch(e => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  const isEdit = req.query.edit;
  
  Product.findByPk(id)
    .then(product => {
      if (!product) {
        return res.redirect('/admin/products');
      }
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/products',
        isEdit,
        isAuthenticated: req.session.isLogin 
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Product.findByPk(id)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save(); 
    })
    .then(result => {
      console.log('UPDATED PRODUCT');
      return res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.findByPk(id)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('DELETED PRODUCT');
      return res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
};