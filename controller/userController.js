/* eslint-disable no-console */
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/AppError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  console.log(newObj);
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for update password. please use /updateMyPassqord.',
        400
      )
    );
  }
  const filterdBody = filterObj(req.body, 'name', 'email', 'photo');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterdBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser
  });
});

exports.creatUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined for Creating user. Try /signup'
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);

//Do not attempt to change password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
