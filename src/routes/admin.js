const express = require('express')
const router = express.Router()
const AdminController = require('../app/Controllers/AdminController')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: path.join(__dirname,'../public/images/') })

router.get('/create', AdminController.addItem)
router.get('/items', AdminController.showItem)
router.get('/users', AdminController.showUser)
router.get('/order', AdminController.showOrder)
router.get('',AdminController.home)


router.post('/create', upload.array('images',8), AdminController.addItem_Post)


module.exports = router