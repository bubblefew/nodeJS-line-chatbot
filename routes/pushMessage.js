var express = require('express');
var router = express.Router();
const controller = require('../controller/pushMessageController')

router.post('/message',  controller.notiForRequest);
router.post('/register',  controller.notiForRegister);
router.post('/tracking',  controller.tracking);



module.exports = router;
