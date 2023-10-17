const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/product');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/products', {
        pageTitle: 'Products',
        path: '/products',
        products,
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
  // const userId = req.session.user.id;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(items => {
      const products = items;
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        items: products,
      });
    })  
    .catch(err => console.log(err));
};

exports.postAddCartItem = (req, res, next) => {
  const productId = req.body.productId;
  // const userId = req.session.user.id;
  let quantity = 1;
  let userCart;
  req.user.getCart()
    .then(cart => {
      userCart = cart;
      return cart.getProducts({
        where: {
          id: productId
        }
      });
    })
    .then(items => {
      let product = items[0];
      if (product) {
        // update existing item
        quantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then(product => {
      return userCart.addProduct(product, {
        through: {
          quantity
        }
      });
    })
    .then(result => {
      console.log('ADDED TO CART');
      return res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const id = req.body.id;
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
      return cart.getProducts({
        where: {
          id
        }
      });
    })
    .then(items => {
      return items[0].cartItem.destroy();
    })
    .then(result => {
      console.log('DELETE CART ITEM');
      return res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
    .then(orders => {
      console.log(orders);
      res.render('shop/order', {
        pageTitle: 'Your Orders',
        orders,
        path: '/orders'
      });   
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCreateOrder = (req, res, next) => {
  let fetchCart;
  req.user.getCart()
    .then(cart => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = {
              quantity: product.cartItem.quantity
            }
            return product;
          }));
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(() => {
      return fetchCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    });
};