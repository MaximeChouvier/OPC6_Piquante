const express = require('express');
const router = express.Router();
const sauceCtrl = require('../Controllers/sauce');
const auth = require("../Middlewares/auth")
const multer = require("../Middlewares/multer-config");


router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.addSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);


module.exports = router;