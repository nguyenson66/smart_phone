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
        const data_order = await QueryDatabase.getAllOrder()
        const sp = await QueryDatabase.getAll(`select count(id) as count from products where quantity between 0 and 10`)
        if(role == 1)
            role = 'Nhân viên'
        else{
            role = 'Admin shop'
            data_order.admin = 'yes'
        }

        for(let i=0;i<data_order.length;i++)
            data_order[i].created_at = moment(data_order[i].created_at,"LLL").fromNow()

        res.render('adminLayouts/home',{
            username : req.cookies.username,
            data_order : data_order,
            countOrder : data_order.length,
            role : role,
            sp : sp[0].count
        })
    }

    //[GET] /admin/create
    async addItem(req,res){
        //check if user is client => redirect :/
        const role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/')
        ////////////////////////////////////////


        res.render('adminLayouts/createItem', {
            admin : 'yes'
        })
    }

    //[GET] /admin/update/:id
    async updateItem(req,res){
        //check if user is client => redirect :/
        const role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/')
        ////////////////////////////////////////

        /// loading... ///
    }

    //[GET] /admin/items
    async showItem(req,res){
        //check if user is client => redirect :/
        let role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/')
        ////////////////////////////////////////
        const data = await QueryDatabase.getAll('select * from products')
        const sp = await QueryDatabase.getAll(`select count(id) as count from products where quantity between 0 and 10`)
        
        if(role == 1)
            role = 'Nhân viên'
        else{
            role = 'Admin shop'
            data.admin = 'yes'
        }

        res.render('adminLayouts/itemManager',{
            username : req.cookies.username,
            role : role,
            countItem : data.length,
            dataItem : data,
            sp : sp[0].count
        })
    }

    //[GET] /admin/users
    async showUser(req,res){
        //check if user is client => redirect :/
        const role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/')
        ////////////////////////////////////////

        const data = await QueryDatabase.getAll('select name, email, phone, address from users')
        res.json(data)
    }


    //[GET] /admin/order
    async showOrder(req,res) {
        //check if user is client => redirect :/
        const role = await checkAdmin(req.cookies.user_token)
        if(role == 0)
            res.redirect('/')
        ////////////////////////////////////////

        const data = await QueryDatabase.getAll('select user_id, product_id, quantity from orders')
        res.json(data)
    }

    ///// JUST ADMIN /////

    //[GET] /admin/revenue
    async revenue(req,res){
        //check if user is client or staff => redirect :/
        const role = await checkAdmin(req.cookies.user_token)
        if(role < 2)
            res.redirect('/home')
        ////////////////////////////////////////


        res.render('adminLayouts/revenue')
    }

    ///////////////////////

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
    async delivered(req,res) {
        const order_id = req.params.id
        QueryDatabase.addHistoryOrderItem(order_id, moment().format("LLL"))
        res.redirect('/admin')
    }
}

module.exports = new AdminController