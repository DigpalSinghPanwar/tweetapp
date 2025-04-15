const {
  signinValidator,
  signupValidator,
} = require("../validators/userValidator");

const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.signin = catchAsync(async (req, res, next) => {
  const body = req.body;
  console.log(body);
  const result = signinValidator.safeParse(req.body);
  console.log(result);
  if (!result.success) {
    return next(new AppError("provide correct email and password", 400));
  }

  return res.status(201).json({
    status: "success",
    data: {},
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  const { success, error } = signupValidator.safeParse(req.body);
  if (!success) {
    console.log(error.issues);
    console.log(error.format());
    return new AppError("Provide correct credentials", 400);
  }
  res.status(200).json({
    status: "success",
    data: {},
  });
});
