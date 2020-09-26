const hotelModel = require('./../model/hotelModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverView = catchAsync(async (req, res, next) => {
  const hotels = await hotelModel.find();
  res.render('home', {
    title: 'Knights inn|Book your favourite Place now',
    hotels
  });
});
