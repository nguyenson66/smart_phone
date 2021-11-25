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
        const data = await QueryDatabase.getAll('select id,name,description,price,quantity,manufacturer from products where id = ' + id)
        const image_item = await QueryDatabase.getAll('select image from images where product_id = ' + id)
        const comment = await QueryDatabase.getComment(id)
        // console.log(comment.length)

        // console.log(image_item[0].image)

        const username = req.cookies.username
        if(username == undefined){
            res.render('clientLayouts/showItem',{
                item : data[0],
                image : image_item,
                comment : comment,
                countComment : comment.length
            })
        }
        else{
            res.render('clientLayouts/showItem',{
                item : data[0],
                image : image_item,
                user : username,
                comment : comment,
                countComment : comment.length
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
            const infor_order = await QueryDatabase.getAll(`select id, payment_info,status, cost, created_at from orders where user_id = ${user_id} and (status = 1 or status = 2)`)
            
            for(let i=0;i<infor_order.length;i++){
                const order_id = infor_order[i].id

                const order_detail = await QueryDatabase.getAll(`select name, price, order_detail.quantity, image from order_detail, products, images
                where order_detail.order_id = ${order_id} and products.id = order_detail.product_id and images.product_id = products.id
                group by products.id`)

                infor_order[i].order_detail = order_detail
                // console.log(infor_order[i])
            }

            // console.log(infor_order[0].order_detail)


            if(infor_order.length == 0){
                res.render('clientLayouts/order',{
                    user : data_user.name
                })
            }


            res.render('clientLayouts/order',{
                user : data_user.name,
                infor_order : infor_order
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

            const data_order = await QueryDatabase.getAll(`select orders.id ,products.id as product_id, products.name as product_name,products.price ,image, orders.quantity as quantity from orders,products,images 
            where orders.user_id = ${user_id} and images.product_id = orders.product_id and products.id = orders.product_id and status = 1
            group by products.name`)

            // console.log(data_order)

            res.render('clientLayouts/historyOrder',{
                user : data_user.name,
                order : data_order
            })
        }      
    }

    //[GET] /search
    async searchItem(req,res){
        let key_search = req.query.q
        if(key_search === undefined)
            key_search = req.query.manufacturer

        const data = await QueryDatabase.searchItem(key_search)
        const username = req.cookies.username
        if(username == undefined){
            res.render('clientLayouts/search',{
                key_search : key_search,
                items: data
            })
        }
        else{
            res.render('clientLayouts/search',{
                key_search : key_search,
                items: data,
                user : username
            })
        }
    }

    //[GET] /cart
    async cart(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id

            const check = await QueryDatabase.getAll(`select count(*) as count from orders where user_id = ${user_id} and status = 0`)
            // console.log(check[0].count)
            if(check[0].count == 0)
                await QueryDatabase.addNewOrder(user_id)

            const data = await QueryDatabase.getProductInCart(user_id)
            const order_id = await QueryDatabase.getAll(`select id from orders where user_id = ${user_id} and status = 0`)
            // console.log(order_id)

            if(data.length == 0){
                res.render('clientLayouts/cart',{
                    user : data_user.name
                })
            }

            res.render('clientLayouts/cart',{
                user : data_user.name,
                cart : data,
                order_id : order_id[0].id
            })
        }
    }

    //[GET] /profile
    userProfile(req,res){
        
        res.render('clientLayouts/userProfile')
    }


    
    ////////// POST ///////////////

    //[POST] /login
    async loginPOST(req,res){
        const result = await QueryDatabase.login(req.body.phone,req.body.password)
        // console.log(result[0])
        if(result[0] == undefined){
            res.cookie('error','1',{ expires: new Date(Date.now() + 7200000)})
            res.redirect('/login')
        }
        else{
            const token = jwt.sign({
                id : result[0].id,
                name : result[0].name
            }, 'sositech', { expiresIn: '2h' })
            
            res.cookie('user_token', token, { expires: new Date(Date.now() + 7200000)})
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
            QueryDatabase.register(name,email,phone,password,address,role,'null')
            res.redirect('/login')
        }
        else{
            res.cookie("error",'Tài khoản đã tồn tại', { expires: new Date(Date.now() + 7200000)})
            res.redirect('back')
        }
    }


    //[POST] /logout
    logoutPOST(req,res){
        res.cookie('user_token','', {maxAge : 0})
        res.cookie('username','', {maxAge : 0})
        res.redirect('/home')
    }

    //[POST] /order/:id
    async orderItemPOST(req,res){
        const user_token = req.cookies.user_token
        // console.log(req.body)
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id
            const order_id = req.params.id
            const time = moment().format("LLL")
            const cost = await QueryDatabase.getCostOrder(order_id)
            // console.log(cost)

            QueryDatabase.orderItem(order_id,time,cost[0].cost)
            QueryDatabase.addNewOrder(user_id)
        
            res.redirect('/order')
        }
    }

    //[POST] /comment/:id
    comment(req,res){
        const user_token = req.cookies.user_token
        const product_id = req.params.id
        const data_user = jwt.verify(user_token,'sositech')
        const user_id = data_user.id
        const content = req.body.content
        const time  = moment().format("LLL")
        // console.log(product_id + " " + user_id + " " + content)
        // console.log(time)

        QueryDatabase.pushComment(user_id,product_id,content,time)

        res.redirect('back')
    }
    
    //[POST] /cart/:id
    async addProductToCart(req,res){
        const user_token = req.cookies.user_token
        // console.log(req.body)
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id
            const product_id = req.params.id
            const quantity = req.body.quantity

            const check = await QueryDatabase.getAll(`select count(*) as count from orders where user_id = ${user_id} and status = 0`)
            // console.log(check[0].count)
            if(check[0].count == 0)
                QueryDatabase.addNewOrder(user_id)

            QueryDatabase.addProductToCart(user_id, product_id, quantity)
        
            res.redirect('/cart')
        }
    }

}

module.exports = new ClientController