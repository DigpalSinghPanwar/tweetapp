const { Router } = require("express");
const {
  createTweet,
  updateTweet,
  getAllTweet,
  getTweet,
  deleteTweet,
  likeTweet,
  replyTweet,
  getReplies,
} = require("../controllers/tweetController");
const { protect } = require("../controllers/authController");

const router = Router();

router.route("/").get(protect, getAllTweet).post(protect, createTweet);
router
  .route("/:id")
  .get(protect, getTweet)
  .patch(protect, updateTweet)
  .delete(protect, deleteTweet);

router.route("/:id/like").get(protect, likeTweet);
router.route("/:id/reply").post(protect, replyTweet);
router.route("/:id/replies").get(protect, getReplies);

module.exports = router;
