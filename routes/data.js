var express = require("express");
var router = express.Router();
const controller = require("../controller/dataController");

router.post("/registermember", controller.registerMember);

module.exports = router;
