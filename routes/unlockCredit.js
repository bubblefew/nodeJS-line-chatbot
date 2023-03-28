var express = require("express");
var router = express.Router();
const controller = require("../controller/unlockCreditController");

router.post("/unlockcreditlimit", controller.unlockCreditLimit);

module.exports = router;
