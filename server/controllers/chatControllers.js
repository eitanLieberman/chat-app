const { json } = require("express");
const Chat = require("../models/chat");
const User = require("../models/user");

//@description     Create or fetch One to One Chat
//@access          Protected
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },

      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
    return;
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (err) {
      res.json(err);
    }
  }
};

//@description     Fetch all chats for a user
//@access          Protected
const fetchChats = async (req, res) => {
  try {
    const findChat = await Chat.find({
      users: { $elemMatch: { $eq: req.user?.id || req.user?._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const result = await User.populate(findChat, {
      path: "latestMessage.sender",
      select: "username pic email",
    });

    return res.status(200).send(result);
  } catch (err) {
    json("cannot display");
  }
};

//@description     Create New Group Chat
//@access          Protected
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user.id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc    Rename Group
// @access  Protected
const renameGroup = async (req, res) => {
  try {
    if (req.body.oldName === "main") {
      throw new Error("main chat can't be renamed");
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chatId,

      {
        chatName: req.body.chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(updatedChat);
  } catch (err) {
    res.status(400).json(err);
  }
};
// @desc    Add user to Group
// @access  Protected
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const targetChat = await Chat.findById(chatId);
  //can't add a user who is already in group
  targetChat.users.forEach((user) => {
    if (user.toString() === userId) {
      res.status(400).json("already in group");
    }
  });

  if (
    req.user.id !== targetChat.groupAdmin.toString() &&
    targetChat.chatName !== "main"
  ) {
    res.status(401).json("not group admin");
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(201).json(added);
};
// @desc    Remove user from Group
// @access  Protected
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const targetChat = await Chat.findById(chatId);

  if (req.user.id !== targetChat.groupAdmin.toString()) {
    res.status(404);
    throw new "main chat can't be renamed"("not group admin");
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(201).json(removed);
};
// @desc    user leaves group
// @access  Protected
const leaveGroup = async (req, res) => {
  const { chatId } = req.body;

  const targetChat = await Chat.findById(chatId);

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: req.user.id },
      groupAdmin: targetChat.users[0],
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(201).json(removed);
};
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup,
};
