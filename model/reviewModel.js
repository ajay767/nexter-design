/* eslint-disable no-console */
const mongoose = require('mongoose');
const Hotel = require('./hotelModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    Hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
      required: [true, 'Review must belong to a Hotel!']
    },
    User: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User!']
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

reviewSchema.index({ Hotel: 1, User: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'User',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(hotelId) {
  const stats = await this.aggregate([
    {
      $match: { Hotel: hotelId }
    },
    {
      $group: {
        _id: '$Hotel',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsAvg: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  } else {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsAvg: 4.5,
      ratingsQuantity: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.Hotel);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.Hotel);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
