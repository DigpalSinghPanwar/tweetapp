const Tweet = require("../models/tweetSchema");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  createTweetValidator,
  createCommentValidator,
} = require("../validators/tweetValidator");

exports.createTweet = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  const { success } = createTweetValidator.safeParse({
    description,
  });
  console.log(success);
  if (!success) {
    return next(new AppError("Provide the values", 404));
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

exports.updateTweet = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  const { id } = req.params;
  const { success } = createTweetValidator.safeParse({
    description,
  });
  if (!success) {
    return next(new AppError("Provide the values", 404));
  }

  const tweet = await Tweet.findById(id);

  if (!tweet) {
    return next(new AppError("Tweet not found", 404));
  }

  if (tweet.user.toString() !== req.user.id) {
    return next(new AppError("you are not allowed to update this tweet", 403));
  }

  const newTweet = await Tweet.findByIdAndUpdate(
    id,
    {
      description,
      user: req.user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      newTweet,
    },
  });
});

exports.getAllTweet = catchAsync(async (req, res, next) => {
  const tweets = await Tweet.find();
  res.status(200).json({
    status: "success",
    data: {
      tweets,
    },
  });
});

exports.getTweet = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("id is required", 400));
  }
  const tweet = await Tweet.findById(id);
  res.status(200).json({
    status: "success",
    data: {
      tweet,
    },
  });
});

exports.deleteTweet = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tweet = await Tweet.findById(id);

  if (!tweet) {
    return next(new AppError("id is required", 400));
  }

  if (tweet.user.toString() !== req.user.id) {
    return next(new AppError("only owner cand delete the tweet", 403));
  }

  // await Tweet.findByIdAndDelete(id);
  await tweet.deleteOne();
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.likeTweet = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  if (!id) {
    return next(new AppError("id is required", 400));
  }
  const tweet = await Tweet.findById(id);
  if (!tweet) {
    return next(new AppError("Tweet not found", 404));
  }

  const alreadyLikes = tweet.likes.includes(userId);

  if (alreadyLikes) {
    tweet.likes.pull(userId);
  } else {
    tweet.likes.push(userId);
  }

  await tweet.save();

  res.status(200).json({
    status: "success",
    liked: !alreadyLikes,
    totalLikes: tweet.likes.length,
  });
});

exports.replyTweet = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user._id;

  const { status } = createCommentValidator.safeParse({
    comment,
  });

  console.log(status, "comment status");

  if (!comment || comment.trim() === "") {
    return next(new AppError("Comment cannot be empty", 400));
  }

  const tweet = await Tweet.findById(id);

  if (!tweet) {
    return next(new AppError("Tweet Not Found", 404));
  }

  tweet.replies.push({
    user: userId,
    comment,
  });

  console.log(tweet);

  await tweet.save();

  res.status(201).json({
    status: "success",
    message: "reply added",
    tweet,
  });
});

exports.getReplies = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tweet = await Tweet.findById(id).populate(
    "replies.user",
    "username about"
  );

  if (!tweet) {
    return next(new AppError("Tweet not found", 404));
  }

  res.status(200).json({
    status: "success",
    replies: tweet.replies,
  });
});
