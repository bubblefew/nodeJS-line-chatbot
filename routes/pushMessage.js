var express = require('express');
var router = express.Router();
const controller = require('../controller/pushMessageController')

router.get('/message/:cono/:divi/:reqno',  controller.notiForRequest);


module.exports = router;
