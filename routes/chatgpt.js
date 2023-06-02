var express = require("express");
var router = express.Router();
const controller = require("../controller/callChatGPTController");

router.post("/chat", controller.getChatbotResponse);

module.exports = router;
