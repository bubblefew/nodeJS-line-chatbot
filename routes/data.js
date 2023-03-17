var express = require('express');
var router = express.Router();
const controller = require('../controller/dataController')

router.post('/regitermember',  controller.regiterMember);



module.exports = router;
