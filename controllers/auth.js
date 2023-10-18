const Cart = require('../models/cart');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.getSignin = (req, res, next) => {
  let message = req.flash('error');

  if (message.length === 0) {
    message = null;
  }
  res.render('auth/sign-in', {
    pageTitle: 'Sign In',
    path: '/signin',
    message
  });
};

exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({ where: {
    email: email
  } })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password!');
        return res.redirect('/signin');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            req.flash('error', 'Invalid email or password!');
            return res.redirect('/signin');
          }
          req.session.isLogin = true;
          req.session.user = user;
          req.session.save(() => {
            return res.redirect('/');
          });
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/sign-up', {
    pageTitle: 'Sign Up',
    path: '/signup',
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword; 
  User.findOne({
    where: {
      email: email
    }
  })
    .then(user => {
      if (user) {
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12);
    })
    .then(hashCode => {
      return User.create({
        email: email,
        password: hashCode
      });
    })
    .then(user => {
      return user.createCart();
    })
    .then(result => {
      return res.redirect('/signin');
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postSignout = (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect('/');
  });
};