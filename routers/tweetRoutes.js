const { Router } = require("express");
const {
  createTweet,
  updateTweet,
  getAllTweet,
  getTweet,
  deleteTweet,
} = require("../controllers/tweetController");

const router = Router();

router.route("/").get(getAllTweet).post(createTweet);
router.route("/:id").get(getTweet).patch(updateTweet).delete(deleteTweet);

module.exports = router;
