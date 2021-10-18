const express = require('express')
const router = express.Router()
const ClientController = require('../app/Controllers/ClientController')

router.get('/register', ClientController.register)
router.get('/login',ClientController.login)
router.get('/home',ClientController.home)
router.get('',ClientController.home)


router.post('/register', ClientController.registerPOST)
router.post('/login',ClientController.loginPOST)

module.exports = router