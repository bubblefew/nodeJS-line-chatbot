const express = require("express");
var router = express.Router();
const controller = require("../controller/dataController");


router.get("/getSQL", controller.getData);

module.exports = router;
