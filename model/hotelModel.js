const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'A hotel must have a name!']
    },
    description: {
      type: String,
      required: [true, 'Please specify the description about hotel']
    },
    situatedAt: {
      type: String,
      required: [true, 'Please provide a nearest city name']
    },
    imageCover: {
      type: String,
      required: [true, 'Please provide a cover image for the hotel']
    },
    images: [String],
    price: {
      type: Number,
      default: 1500
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    secretHotel: {
      type: Boolean,
      default: false
    },
    coupleFriendly: {
      type: Boolean,
      default: true
    },
    ratingsAvg: {
      type: Number,
      default: 4.5,
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    locations: {
      //geoJSON -- mongo data type
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    guide: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
hotelSchema.index({ locations: '2dsphere' });
hotelSchema.index({ price: 1, ratingsAvg: -1 });

//virtual populate
hotelSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'Hotel',
  localField: '_id'
});

hotelSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guide',
    select: '-__v -passwordChangedAt'
  });
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
