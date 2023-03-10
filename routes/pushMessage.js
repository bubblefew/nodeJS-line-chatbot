var express = require('express');
var router = express.Router();
const controller = require('../controller/pushMessageController')

router.post('/message',  controller.notiForRequest);



module.exports = router;
