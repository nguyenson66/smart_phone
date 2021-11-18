const QueryDatabase = require('../../config/db')
const jwt = require('jsonwebtoken')
const moment = require('moment')

class ClientController{

    /// [GET] :/home
    async home(req,res){
        let page = 0
        if(req.query.page != undefined)
            page = req.query.page-1
        
        const data = await QueryDatabase.getItem(page)

        const username = req.cookies.username
        if(username == undefined){
            res.render('clientLayouts/home',{
                items: data
            })
        }
        else{
            res.render('clientLayouts/home',{
                items: data,
                user : username
            })
        }

    }

    //[GET] /login
    login(req,res){
        res.render('clientLayouts/login')
    }

    //[GET] /register
    register(req,res){
        res.render('clientLayouts/register')
    }


    //[GET] /item/:id
    async showItem(req,res){
        const id = req.params.id
        const data = await QueryDatabase.getAll('select id,name,description,price,quantity,manufacturer from items where id = ' + id)
        const image_item = await QueryDatabase.getAll('select image from images where item_id = ' + id)

        const username = req.cookies.username
        if(username == undefined){
            res.render('clientLayouts/showItem',{
                item : data[0],
                image : image_item[0]
            })
        }
        else{
            res.render('clientLayouts/showItem',{
                item : data[0],
                image : image_item[0],
                user : username
            })
        }
    }

    //[GET] /order
    async order(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id

            const data_order = await QueryDatabase.getAll(`select orders.id ,items.id as item_id, items.name as item_name,items.price ,image, orders.quantity as quantity from orders,items,images 
            where orders.user_id = ${user_id} and images.item_id = orders.item_id and items.id = orders.item_id
            group by items.name`)

            // console.log(data_order)

            res.render('clientLayouts/order',{
                user : data_user.name,
                order : data_order
            })
        }
        
    }

    //[GET] /historyOrder
    async historyOrder(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id

            const data_order = await QueryDatabase.getAll(`select items.id as item_id, items.name as item_name,items.price ,image, history_orders.quantity as quantity from history_orders,items,images 
            where history_orders.user_id = ${user_id} and images.item_id = history_orders.item_id and items.id = history_orders.item_id
            group by items.name`)

            // console.log(data_order)

            res.render('clientLayouts/historyOrder',{
                user : data_user.name,
                order : data_order
            })
        }      
    }

    //[GET] /search
    async searchItem(req,res){
        console.log(req.query)
        res.redirect('back')
    }


    
    ////////// POST ///////////////

    //[POST] /login
    async loginPOST(req,res){
        const result = await QueryDatabase.login(req.body.phone,req.body.password)
        // console.log(result[0])
        if(result[0] == undefined){
            res.redirect('/login')
        }
        else{
            const token = jwt.sign({
                id : result[0].id,
                name : result[0].name
            }, 'sositech', { expiresIn: '2h' })
            
            res.cookie('user_token', token, { expires: new Date(Date.now() + 7200000) })
            res.cookie('username',result[0].name, { expires: new Date(Date.now() + 7200000) })

            res.redirect('/home')
        }
    }


    //[POST] /register
    async registerPOST(req,res){
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const name = req.body.name
        const address = req.body.address
        const role = 'client'

        const data = await QueryDatabase.getAll(`select count(*) as countuser from users where phone = '${phone}' or email = '${email}'`)
        
        if(data[0].countuser == 0){
            QueryDatabase.register(name,email,phone,password,address,role)
        }
        res.redirect('/login')
    }


    //[POST] /logout
    logouPOST(req,res){
        res.cookie('user_token','', {maxAge : 0})
        res.cookie('username','', {maxAge : 0})
        res.redirect('/home')
    }

    //[POST] /order/:id
    orderItemPOST(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id
            const item_id = req.params.id


            req.body.quantity = 1
            //////
            const quantity = req.body.quantity

            QueryDatabase.orderItem(user_id,item_id,quantity,moment().format("YYYY/MM/DD"))

            res.redirect('/order')
        }
    }

}

module.exports = new ClientController