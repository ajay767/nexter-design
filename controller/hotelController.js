/* eslint-disable no-console */
const factory = require('./handlerFactory');
const Hotel = require('./../model/hotelModel');
const AppError = require('../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllHotel = factory.getAll(Hotel);
exports.findHotelByID = factory.getOne(Hotel, { path: 'reviews' });

exports.hotelRegistration = factory.createOne(Hotel);

exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);

//hotel-within/:distance/center/:latlng/unit/:unit
exports.getHotelWithin = catchAsync(async (req, res, next) => {
  const { distance, unit, latlng } = req.params;
  const lat = latlng.split(',')[0];
  const lng = latlng.split(',')[1];
  if (!lat || !lng) {
    return next(new AppError('Please provide valid coordiinates!', 400));
  }
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  console.log(distance, unit, lat, lng);

  const hotels = await Hotel.find({
    locations: { $geoWithin: { $centerSphere: [[lng * 1, lat * 1], radius] } }
  });

  res.status(200).json({
    status: 'success',
    result: hotels.length,
    data: {
      hotels
    }
  });
});

exports.getDistance = catchAsync(async (req, res, next) => {
  const { unit, latlng } = req.params;
  const lat = latlng.split(',')[0];
  const lng = latlng.split(',')[1];
  if (!lat || !lng) {
    return next(new AppError('Please provide valid coordinates!', 400));
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Hotel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances
    }
  });
});
