const { Router } = require("express");
const {
  signin,
  signup,
  protect,
  restrictTo,
} = require("../controllers/authController");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
} = require("../controllers/userController");

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/all", protect, getAllUser);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, restrictTo("admin", "super-admin"), deleteUser);

module.exports = router;
