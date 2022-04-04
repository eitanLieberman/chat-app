const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const router = require("../router");
const { verifyToken } = require("./verifyToken");
const { getAll, sendMessage } = require("../controllers/messageController");
//get all messages
router.get("/:chatId", verifyToken, getAll);
//send a message
router.post("/", verifyToken, sendMessage);

module.exports = router;
