const express = require('express');

const authController = require('./../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotpassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//protect middleware--all the request below require user to be LOGEDIN!
router.use(authController.protect);

router.route('/me').get(userController.getMe, userController.getUser);

router.patch('/updateMe', userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

router.patch('/updateMyPassword', authController.updatePassword);

//restrict middleware--all the request below require user to be admin!
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.creatUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
