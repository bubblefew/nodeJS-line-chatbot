const express = require("express");
var router = express.Router();
const controller = require("../controller/loginController");

router.get("/login", controller.login);

module.exports = router;
