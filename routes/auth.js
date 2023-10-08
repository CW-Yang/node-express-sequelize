const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/signin', authController.getSignin);
router.post('/signin', authController.postSignin);

router.post('/signout', authController.postSignout);

module.exports = router;