const Comment = require("../models/commentSchema");
const Tweet = require("../models/tweetSchema");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { getPaginatedResults } = require("../utils/paginate");
const {
  createTweetValidator,
  createCommentValidator,
} = require("../validators/tweetValidator");

exports.createTweet = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  const { success } = createTweetValidator.safeParse({
    description,
  });
  if (!success) {
    return next(new AppError("Provide the values", 404));
  }
  const newTweet = await Tweet.create({
    description,
    user: req.user._id,
  });
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
  const limit = req?.query?.limit;
  const page = req?.query?.page || 1;

  // Step 1: Get paginated tweets
  const paginated = await getPaginatedResults(
    Tweet,
    {},
    {
      page,
      limit,
      sort: "-createdAt",
      populate: { path: "user", select: "username about" },
    }
  );

  // Step 2: Get tweet IDs
  const tweetIds = paginated.results.map((tweet) => tweet._id);

  // Step 3: Get comment counts grouped by tweet
  const commentCountMap = {};
  const commentCounts = await Comment.aggregate([
    { $match: { tweet: { $in: tweetIds } } },
    { $group: { _id: "$tweet", count: { $sum: 1 } } },
  ]);
  commentCounts.forEach((c) => (commentCountMap[c._id.toString()] = c.count));

  // Step 4: Format final tweets
  const tweetsWithCounts = paginated.results.map((tweet) => ({
    _id: tweet._id,
    description: tweet.description,
    username: tweet.user.username,
    about: tweet.user.about,
    likeCount: tweet.likes.length,
    commentCount: commentCountMap[tweet._id.toString()] || 0,
    createdAt: tweet.createdAt,
  }));

  res.status(200).json({
    status: "success",
    data: {
      tweets: tweetsWithCounts,
    },
    pagination: {
      total: paginated.total,
      currentPage: paginated.currentPage,
      totalPages: paginated.totalPages,
    },
  });
});

exports.getTweet = catchAsync(async (req, res, next) => {
  // const { id } = req.params;
  // if (!id) {
  //   return next(new AppError("id is required", 400));
  // }
  // const tweet = await Tweet.findById(id);

  const tweetId = req.params.id;

  if (!tweetId) {
    return next(new AppError("id is required", 404));
  }

  // Step 1: Get the tweet and populate username
  const tweet = await Tweet.findById(tweetId).populate({
    path: "user",
    select: "username",
  });

  if (!tweet) {
    return next(new AppError("tweet not found", 404));
  }

  // Step 2: Count the total number of comments for the tweet
  const commentCount = await Comment.countDocuments({ tweet: tweetId });

  // Step 3: Structure the final response
  const result = {
    _id: tweet._id,
    description: tweet.description,
    username: tweet.user.username,
    likeCount: tweet.likes.length,
    commentCount: commentCount,
    createdAt: tweet.createdAt,
  };

  res.status(200).json({
    status: "success",
    data: {
      result,
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
  const userId = req.user.id;
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
