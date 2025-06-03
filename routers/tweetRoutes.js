const { Router } = require("express");
const {
  createTweet,
  updateTweet,
  getAllTweet,
  getTweet,
  deleteTweet,
  likeTweet,
} = require("../controllers/tweetController");
const { protect } = require("../controllers/authController");

const router = Router();

router.route("/").get(protect, getAllTweet).post(protect, createTweet);
router.get("/:id/like", protect, likeTweet);
router
  .route("/:id")
  .get(protect, getTweet)
  .patch(protect, updateTweet)
  .delete(protect, deleteTweet);

module.exports = router;
