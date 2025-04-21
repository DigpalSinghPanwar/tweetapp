const Comment = require("../models/commentSchema");
const catchAsync = require("../utils/catchAsync");
const { getPaginatedResults } = require("../utils/paginate");
const { createCommentValidator } = require("../validators/tweetValidator");

exports.getComments = catchAsync(async (req, res, next) => {
  const tweetId = req.params.id;
  const limit = req?.query?.limit;
  const page = req?.query?.page || 1;

  if (!tweetId) {
    return next(new AppError("id is required", 400));
  }

  const paginated = await getPaginatedResults(
    Comment,
    { tweet: tweetId },
    {
      page,
      limit,
      sort: "-createdAt",
      populate: { path: "user", select: "username" },
    }
  );

  console.log(paginated);
  // Format comments
  const formatted = paginated.results.map((comment) => ({
    _id: comment._id,
    content: comment.content,
    username: comment.user.username,
    createdAt: comment.createdAt,
  }));

  res.json({
    comments: formatted,
    total: paginated.total,
    currentPage: paginated.currentPage,
    totalPages: paginated.totalPages,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const tweetId = req.params.id;
  const { comment } = req.body;
  const userId = req.user._id;

  if (!tweetId) {
    return next(new AppError("id is required", 400));
  }

  const { status } = createCommentValidator.safeParse({
    comment,
  });

  if (!comment || comment.trim() === "") {
    return next(new AppError("Comment cannot be empty", 400));
  }

  const newComment = await Comment.create({
    tweet: tweetId,
    user: userId,
    comment,
  });

  res.status(201).json({
    status: "success",
    message: "comment created",
    data: {
      newComment,
    },
  });
});
