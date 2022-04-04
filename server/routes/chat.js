const Chat = require("../models/chat");
const User = require("../models/user");
const { verifyToken } = require("./verifyToken");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup,
} = require("../controllers/chatControllers");
const router = require("express").Router();

//start/access a chat
router.post("/", verifyToken, accessChat);

//display all user chats
router.get("/", verifyToken, fetchChats);

//create a group chat
router.post("/group", verifyToken, createGroupChat);

//change chat name

router.put("/rename", verifyToken, renameGroup);

//remove from chat

router.put("/remove", verifyToken, removeFromGroup);

router.put("/invite", verifyToken, addToGroup);

//remove from  CHAT
router.put("/leave", verifyToken, leaveGroup);

module.exports = router;
