const {
  changeUsername,
  deleteUser,
  searchUser,
  findAllUsers,
} = require("../controllers/userController");

const {
  verifyToken,
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
//changing username
router.put("/:id", verifyTokenAndAuthorize, changeUsername);
//deleting user
router.delete("/:id", verifyTokenAndAdmin, deleteUser);

//search for users
router.get("/find/:id", verifyToken, searchUser);

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, findAllUsers);

module.exports = router;
