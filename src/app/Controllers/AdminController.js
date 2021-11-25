const QueryDatabase = require('../../config/db')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const data_key = require('../../util/allKey')
const fs = require('fs')


async function checkAdmin(token){

    if(token == undefined)
        return 0
    
    const  data = new Promise((resolve,reject) => {
        jwt.verify(token, 'sositech',async function(err, decoded) {
            if(err){
                resolve(0)
            }
            else{
                const id = decoded.id
                let role = await QueryDatabase.getRole(id)
                role = role[0].role
                
                if(role === 'admin')
                    resolve(2)
                else if(role === 'staff')
                    resolve(1)
                else
                    resolve(0)
            }
        });
    })
    return data
}

function getIDAdmin(token){

    const decoded = jwt.verify(token,'sositech')
    return decoded
}


class AdminController{




    /////////////////// GET //////////////////

    // [GET] /admin
    async home(req,res){

        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////


        let order = await QueryDatabase.getAll(`select orders.id, users.name, orders.created_at from users, orders where status = 1 and users.id = orders.user_id`)
        
        for(let i=0;i<order.length;i++){
            const order_detail = await QueryDatabase.getAll(`select products.name, price, order_detail.quantity as quantityOrder from order_detail, products
            where order_detail.order_id = ${order[i].id} and order_detail.product_id = products.id`)

            order[i].order_detail = order_detail
        }
        
        // console.log(order[0])

        if(order.length == 0){
            res.render('adminLayouts/home',{
                username : req.cookies.username,
                role : role
            })
        }

        res.render('adminLayouts/home',{
            username : req.cookies.username,
            role : role,
            order: order
        })
    }

    //[GET] /admin/create
    async addItem(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////


        res.render('adminLayouts/createItem', {
            username : req.cookies.username,
            role : role
        })
    }

    //[GET] /admin/update/:id
    async updateItem(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////


        res.render('adminLayouts/createItem', {
            username : req.cookies.username,
            role : role
        })
    }

    //[GET] /admin/items
    async showItem(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
        res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////
        const data = await QueryDatabase.getAll('select * from products')


        res.render('adminLayouts/itemManager', {
            username : req.cookies.username,
            role : role,
            dataItem : data
        })
    }

    //[GET] /admin/user
    async showUser(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////


        res.render('adminLayouts/revenue', {
            username : req.cookies.username,
            role : role
        })
    }


    //[GET] /admin/order
    async showOrder(req,res) {
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////

        let order = await QueryDatabase.getAll(`select orders.id, users.name, orders.created_at from users, orders where status = 2 and users.id = orders.user_id`)
        
        for(let i=0;i<order.length;i++){
            const order_detail = await QueryDatabase.getAll(`select products.name, price, order_detail.quantity as quantityOrder from order_detail, products
            where order_detail.order_id = ${order[i].id} and order_detail.product_id = products.id`)
            
            order[i].order_detail = order_detail
        }

        if(order.length == 0){
            res.render('adminLayouts/orderManager', {
                username : req.cookies.username,
                role : role
            })
        }


        res.render('adminLayouts/orderManager', {
            username : req.cookies.username,
            role : role,
            order : order
        })
    }

    //[GET] /admin/order/:id
    async orderDetail(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////

        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////

        const order_id = req.params.id

        //get all information of order as order_id
        let infor_order = await QueryDatabase.getAll(`select id, payment_info,status, cost, created_at from orders where id = ${order_id}`)
            
        //get all product in order
        const order_detail = await QueryDatabase.getAll(`select name, price, order_detail.quantity, image from order_detail, products, images
        where order_detail.order_id = ${order_id} and products.id = order_detail.product_id and images.product_id = products.id
        group by products.id`)

        infor_order[0].order_detail = order_detail

        //get information user order
        const infor_user = await QueryDatabase.getAll(`select name, email, phone, address from users, orders
        where orders.id = ${order_id} and orders.user_id = users.id`)

        if(infor_order[0].status == 1)
        infor_order[0].confirm = true
        
        // console.log(infor_order[0])

        res.render('adminLayouts/orderDetail', {
            username : req.cookies.username,
            role : role,
            infor_order : infor_order[0],
            infor_user : infor_user[0]
        })    
    }

     /////////////////////// ///// JUST ADMIN ///// ///////////////////////

    //[GET] /admin/revenue
    async revenue(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/home')
        ////////////////////////////////////////
        
        if(role == 1){
            role = {role : 'Nhân Viên'}
        }
        else{
            role = {
                role : 'Quản lí',
                isAdmin : true
            }
        }
        ////////////////////////////////////////


        res.render('adminLayouts/revenue', {
            username : req.cookies.username,
            role : role
        })
    }

    /////////////////////// /////////////////////// ///////////////////////

    /////////// POST /////////////
    
    //[POST] /admin/deleteItem/:id
    deleteItem(req,res){
        const item_id = req.params.id

        QueryDatabase.deleteItem(item_id)
        res.redirect('/admin/items')
    }


    //[POST] /admin/create
    async addItem_Post(req,res){

        const idItem = await QueryDatabase.addItem(req.body)
        // const idAdmin = getIDAdmin(req.cookies.user_token)

        // console.log(idItem[0].id)

        /// add images
        for(let i=0;i<req.files.length;i++){
            const tempPath = req.files[i].path
            const filename = req.files[i].filename + '.png'
            fs.rename(tempPath,tempPath+'.png', err => {
                if(err)
                    console.dir(err.message)
            })
            const kq = await QueryDatabase.addImage(idItem[0].id,filename)
        }

        res.redirect('/admin/create')
    }

    //[POST] /admin/deleteOrder/:id
    deleteOrder(req,res){
        const order_id = req.params.id
        QueryDatabase.deleteOrder(order_id)

        res.redirect('back')
    }

    //[POST] /admin/delivered/:id
    delivered(req,res) {
        const order_id = req.params.id
        QueryDatabase.addHistoryOrderItem(order_id)
        res.redirect('/admin/order')
    }

    //[POST] /admin/confirm-order/:id
    confirmOrder(req,res){
        const order_id = req.params.id
        QueryDatabase.addToOrder(order_id)
        res.redirect('/admin')
    }
}

module.exports = new AdminController