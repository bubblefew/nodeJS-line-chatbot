var express = require("express");
var router = express.Router();
const controller = require("../controller/dialogflowController");

router.post("", controller.dialogflow);

module.exports = router;
