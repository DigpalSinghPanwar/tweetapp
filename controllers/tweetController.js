const { createTweetValidator } = require("../validators/tweetValidator");

exports.createTweet = (req, res, next) => {
  try {
    const body = req.body;
    const { success } = createTweetValidator.safeParse({
      ...req.body,
      user: "1234",
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

exports.updateTweet = (req, res, next) => {
  try {
    const body = req.body;
    const { success } = createTweetValidator.safeParse({
      ...req.body,
      user: "1234",
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

exports.deleteTweet = (req, res, next) => {
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
