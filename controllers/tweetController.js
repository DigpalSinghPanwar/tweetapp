const Tweet = require("../models/tweetSchema");
const catchAsync = require("../utils/catchAsync");
const { createTweetValidator } = require("../validators/tweetValidator");

exports.createTweet = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  const { success } = createTweetValidator.safeParse({
    description,
  });
  console.log(success);
  if (!success) {
    return res.status(404).json({
      status: "failed",
      message: "Provide the values",
    });
  }
  const newTweet = await Tweet.create({
    description,
    user: req.user._id,
  });
  console.log(newTweet);
  res.status(200).json({
    status: "success",
    data: {
      newTweet,
    },
  });
});

exports.updateTweet = (req, res, next) => {
  try {
    const { description } = req.body;
    const { success } = createTweetValidator.safeParse({
      description,
    });
    if (!success) {
      return res.status(404).json({
        status: "failed",
        message: "Provide the values",
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.getAllTweet = (req, res, next) => {
  const data = Tweet.find({});
  res.status(200).json({
    status: "success",
    data,
  });
};

exports.getTweet = (req, res, next) => {
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

exports.deleteTweet = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});
