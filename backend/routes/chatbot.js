const express = require("express");
const router = express.Router();

const chatbotController = require("../controller/chatbot");

router.post("/", chatbotController.getChatResponse);

console.log("Chatbot route loaded");

module.exports = router;
