const express = require('express')
const router = express.Router()
const ClientController = require('../app/Controllers/ClientController')
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname,'../public/avatar/') })

router.get('/register', ClientController.register)
router.get('/login',ClientController.login)
router.get('/home',ClientController.home)
router.get('/item/:id',ClientController.showItem)
router.get('/order',ClientController.order)
router.get('/history-order', ClientController.historyOrder)
router.get('/search', ClientController.searchItem)
router.get('/cart', ClientController.cart)
router.get('/profile', ClientController.userProfile)
router.get('/change-password', ClientController.changePassword)
router.get('',ClientController.home)

router.post('/register', ClientController.registerPOST)
router.post('/login',ClientController.loginPOST)
router.post('/logout',ClientController.logouPOST)
router.post('/order/:id',ClientController.orderItemPOST)
router.post('/comment/:id',ClientController.comment)
router.post('/cart/:id', ClientController.addProductToCart)
router.post('/change-profile',upload.single('avatar'), ClientController.changeProfile)
router.post('/delete-cart/:product_id/:order_id', ClientController.DeleteProductInCart)
router.post('/change-password', ClientController.changePasswordPOST)

module.exports = router