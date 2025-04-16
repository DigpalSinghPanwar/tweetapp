const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: { users },
  });
});

exports.getUser = (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
    });
  }
};

const filterObj = (obj, ...allowedFields) => {
  // ...allowedFields
  const newObj = {};
  // Object.keys(obj) returns an array
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      // newObj is assigned fields which are to be included in it
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  // 2) Filtered out unwanted field names that are not allowed to be updated
  // update this, such as if require photo or any other field to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update User Document
  // new field will return the updated user, validators field will run all the validators in schema
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
