const { Router } = require("express");
const {
  createTweet,
  updateTweet,
  getAllTweet,
  getTweet,
  deleteTweet,
} = require("../controllers/tweetController");
const { protect } = require("../controllers/authController");

const router = Router();

router.route("/").get(protect, getAllTweet).post(protect, createTweet);
router
  .route("/:id")
  .get(protect, getTweet)
  .patch(protect, updateTweet)
  .delete(protect, deleteTweet);

module.exports = router;
