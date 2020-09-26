const Review = require('./../model/reviewModel');
const factory = require('./handlerFactory');

exports.setHotelUserIds = (req, res, next) => {
  if (!req.body.Hotel) req.body.Hotel = req.params.hotelId;
  if (!req.body.User) req.body.User = req.user.id;
  next();
};
exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
