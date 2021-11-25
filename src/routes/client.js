const express = require('express')
const router = express.Router()
const ClientController = require('../app/Controllers/ClientController')

router.get('/register', ClientController.register)
router.get('/login',ClientController.login)
router.get('/home',ClientController.home)
router.get('/item/:id',ClientController.showItem)
router.get('/order',ClientController.order)
router.get('/history-order', ClientController.historyOrder)
router.get('/search', ClientController.searchItem)
router.get('/cart', ClientController.cart)
router.get('/profile', ClientController.userProfile)
router.get('',ClientController.home)

router.post('/register', ClientController.registerPOST)
router.post('/login',ClientController.loginPOST)
router.post('/logout',ClientController.logouPOST)
router.post('/order/:id',ClientController.orderItemPOST)
router.post('/comment/:id',ClientController.comment)
router.post('/cart/:id', ClientController.addProductToCart)

module.exports = router