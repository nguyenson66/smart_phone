const express = require('express')
const router = express.Router()
const ClientController = require('../app/Controllers/ClientController')

router.get('/register', ClientController.register)
router.get('/login',ClientController.login)
router.get('/home',ClientController.home)
router.get('/item/:id',ClientController.showItem)
router.get('',ClientController.home)


router.post('/register', ClientController.registerPOST)
router.post('/login',ClientController.loginPOST)
router.post('/logout',ClientController.logouPOST)

module.exports = router