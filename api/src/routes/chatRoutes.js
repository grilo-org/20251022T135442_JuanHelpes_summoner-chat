const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.chatWithLlama);
router.post("/welcome", chatController.chatWelcome);

module.exports = router;
