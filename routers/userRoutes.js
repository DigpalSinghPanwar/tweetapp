const { Router } = require("express");
const { signin, signup } = require("../controllers/authController");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
} = require("../controllers/userController");

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);

router.get("/alluser", getAllUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
