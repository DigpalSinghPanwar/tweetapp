const Comment = require("../models/commentSchema");
const Tweet = require("../models/tweetSchema");
const User = require("../models/userSchema");
const AppError = require("../utils/appError");
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

exports.getUser = catchAsync(async (req, res, next) => {
  const userDetails = await User.findById(req.user.id);

  if (!userDetails) {
    return next(new AppError("No Such User", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      userDetails,
    },
  });
});

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
  const user = await User.findById(req.params.id);

  if (user._id.toString() !== req.user.id) {
    return next(new AppError("You are not allowed to udpate the user", 403));
  }
  if (req.body.password || req.body.passwordConfirm) {
    // 1) Create error if user POSTs password data

    return next(new AppError("This route is not for password updates.", 400));
  }

  // 2) Filtered out unwanted field names that are not allowed to be updated
  // update this, such as if require photo or any other field to be updated
  const filteredBody = filterObj(req.body, "username", "email", "about");

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

exports.getAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const [tweetCount, likeGivenCount, commentCount] = await Promise.all([
    // 1. Count of tweets by the user
    Tweet.countDocuments({ user: userId }),

    // 2. Count of likes the user has given
    Tweet.countDocuments({ likes: userId }),

    // 3. Count of comments the user has made
    Comment.countDocuments({ user: userId }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      tweetsMade: tweetCount,
      likesGiven: likeGivenCount,
      commentsMade: commentCount,
    },
  });
});
