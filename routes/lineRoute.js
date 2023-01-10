const express = require("express");
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");

var router = express.Router();
const controller = require("../controller/lineController");
dotenv.config().parsed;

const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_TOKEN,
  };
  
  
router.post("/getuserid", line.middleware(config), controller.getUserID);

module.exports = router;
