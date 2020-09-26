const express = require('express');

const authController = require('./../controller/authController');
const reviewRouter = require('./../routes/reviewRoute');
const hotelController = require('./../controller/hotelController');

const router = express.Router();

router.use('/:hotelId/review', reviewRouter);

router
  .route('/hotel-within/:distance/center/:latlng/unit/:unit')
  .get(hotelController.getHotelWithin);

router.route('/distance/:latlng/unit/:unit').get(hotelController.getDistance);

router
  .route('/')
  .get(hotelController.getAllHotel)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.hotelRegistration
  );

router
  .route('/:id')
  .get(hotelController.findHotelByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.updateHotel
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    hotelController.deleteHotel
  );

module.exports = router;
