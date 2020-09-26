const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No Document found with this ID!', 400));
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedDoc)
      return next(new AppError('No Document found with this ID!', 400));

    res.status(200).json({
      status: 'success',
      message: 'updated successfully',
      data: updatedDoc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const data = req.body;

    const doc = await Model.create(data);
    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError('No Document found with this ID!', 400));

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.hotelId) filter = { Hotel: req.params.hotelId };
    const doc = await Model.find(filter);
    if (!doc) return next(new AppError('No Document found!', 400));

    res.status(200).json({
      status: 'success',
      count: doc.length,
      result: doc
    });
  });
