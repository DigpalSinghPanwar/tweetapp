const { Router } = require("express");
const {
  getComments,
  createComment,
} = require("../controllers/commentController");
const { protect } = require("../controllers/authController");

const router = Router();

router.route("/:id").get(protect, getComments).post(protect, createComment);

module.exports = router;
