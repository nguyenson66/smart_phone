const express = require('express')
const router = express.Router()
const AdminController = require('../app/Controllers/AdminController')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: path.join(__dirname,'../public/images/') })

router.get('/create', AdminController.addItem)
router.get('/items', AdminController.showItem)
router.get('/user', AdminController.showUser)
router.get('/order', AdminController.showOrder)
router.get('/revenue', AdminController.revenue)
router.get('/order/:id', AdminController.orderDetail)
router.get('/edit/:id',AdminController.editProduct)
router.get('',AdminController.home)


router.post('/create', upload.array('images',8), AdminController.addItem_Post)
router.post('/deleteOrder/:id',AdminController.deleteOrder)
router.post('/delivered/:id', AdminController.delivered)
router.post('/deleteItem/:id', AdminController.deleteItem)
router.post('/confirm-order/:id', AdminController.confirmOrder)
router.post('/delete-staff/:id' , AdminController.deleteStaff)
router.post('/delete-user/:id', AdminController.deleteUser)
router.post('/set-role-staff/:id', AdminController.setRoleStaff)
router.post('/edit/:id', AdminController.editProductPost)

module.exports = router