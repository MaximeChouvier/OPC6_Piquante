const express = require('express');
const router = express.Router();
const userCtrl = require('../Controllers/user');
const authMiddle = require("../Middlewares/auth");

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.post('/', authMiddle, userCtrl.signup);
router.post('/', authMiddle, userCtrl.login);


module.exports = router;