var express = require('express');
var router = express.Router();
const controller = require('../controller/webHookController')

router.post('',  controller.main);


module.exports = router;
