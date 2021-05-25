const express = require('express');
const router = express.Router();
const sauceCtrl = require('../Controllers/sauce');
const auth = require("../Middlewares/auth")
const multer = require("../Middlewares/multer-config");

router.post('/addSauce', sauceCtrl.addSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.addSauce);



module.exports = router;