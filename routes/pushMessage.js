var express = require("express");
var router = express.Router();
const controller = require("../controller/pushMessageController");

router.post("/message", controller.notiForRequest);
router.post("/successfuly", controller.successfuly);
router.post("/cancel", controller.cancel);
router.post("/register", controller.notiForRegister);
router.post("/tracking", controller.tracking);
router.post("/pendingitems", controller.pendingitems);
router.post("/howtoregis", controller.howtoregis);
router.post("/notireject", controller.notireject);
router.post("/moredetail", controller.moredetail);

module.exports = router;
