const {
  signinValidator,
  signupValidator,
} = require("../validators/userValidator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createWebToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOpitons = {
    expiresIn:
      new Date() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOpitons.secure = true;

  res.cookie("jwt", token, cookieOpitons);

  user.password = undefined;

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signin = catchAsync(async (req, res, next) => {
  const body = req.body;
  const result = signinValidator.safeParse(req.body);
  if (!result.success) {
    return next(new AppError("provide correct email and password", 400));
  }

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user || !(await user.correctPassword(body.password, user.password))) {
    return next(new AppError("Incorrect email and password", 401));
  }

  createWebToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  const { success, error } = signupValidator.safeParse(req.body);
  if (!success) {
    // console.log(error.issues);
    // console.log(error.format());
    return next(new AppError("Provide correct credentials", 401));
  }

  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    username: req.body.username,
  });

  if (!user) {
    return next(new AppError("Provide correct credentials", 401));
  }
  createWebToken(user, 200, res);
  // console.log(user);.
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 403)
    );
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);

  const newUser = await User.findById(decoded.id);
  if (!newUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // console.log(newUser);
  req.user = newUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role);
    // console.log(req.user.username);
    if (!roles.includes(req.user.role)) {
      // console.log(req.user.role, "no role");
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
