var express = require("express");
var router = express.Router();
const controller = require("../controller/pushMessageController");

router.post("/message", controller.notiForRequest);
router.post("/successfuly", controller.successfuly);

router.post("/register", controller.notiForRegister);
router.post("/tracking", controller.tracking);
router.post("/pendingitems", controller.pendingitems);

module.exports = router;
