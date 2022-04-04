const User = require("../models/user");

//@description     Change Username
//@access          Protected
const changeUsername = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
//@description     Admin Option- delete user
//@route           GET /api/user?search=
//@access          Admin Only
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};
//@description     Get single user
//@access          Protected
const searchUser = async (req, res) => {
  try {
    let user = await User.find({
      $or: [
        { email: { $regex: req.params.id, $options: "i" } },
        { username: { $regex: req.params.id, $options: "i" } },
      ],
    });

    const cleanUser = user.map((u) => {
      const { password, ...others } = u._doc;
      u._doc = { ...others };

      return others;
    });

    res.status(200).json(cleanUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
//@description     Get All  users
//@access          Admin Only
const findAllUsers = async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    res.status(200).json(users);
  } catch (err) {
    err;
    res.status(500).json(err);
  }
};
module.exports = { changeUsername, deleteUser, searchUser, findAllUsers };
