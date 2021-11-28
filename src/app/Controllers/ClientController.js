const QueryDatabase = require('../../config/db')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const fs = require('fs')
const path = require('path')

class ClientController{

    /// [GET] :/home
    async home(req,res){
        let page = 0
        if(req.query.page != undefined)
            page = req.query.page-1
        
        const data = await QueryDatabase.getItem(page)

        const user_token = req.cookies.user_token

        if(user_token == undefined){
            res.render('clientLayouts/home',{
                items: data
            })
        }
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_infor = await QueryDatabase.getAll(`select name, avatar from users where id = ${data_user.id}`)
            // console.log(user_infor)

            res.render('clientLayouts/home',{
                items: data,
                user : user_infor[0]
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

        const user_token = req.cookies.user_token

        if(user_token == undefined){
            res.render('clientLayouts/showItem',{
                item : data[0],
                image : image_item,
                comment : comment,
                countComment : comment.length
            })
        }
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_infor = await QueryDatabase.getAll(`select name, avatar from users where id = ${data_user.id}`)

            res.render('clientLayouts/showItem',{
                item : data[0],
                image : image_item,
                user : user_infor[0],
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
            const user_infor = await QueryDatabase.getAll(`select name, avatar from users where id = ${user_id}`)

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
                    user : user_infor[0]
                })
            }
            else{
                res.render('clientLayouts/order',{
                    user : user_infor[0],
                    infor_order : infor_order
                })
            }
        }
        
    }

    //[GET] /history-order
    async historyOrder(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_id = data_user.id
            const user_infor = await QueryDatabase.getAll(`select name, avatar from users where id = ${user_id}`)


            const infor_order = await QueryDatabase.getAll(`select id, payment_info,status, cost, created_at from orders where user_id = ${user_id} and status = 3`)
            
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
                res.render('clientLayouts/historyOrder',{
                    user : user_infor[0]
                })
            }

            else{
                res.render('clientLayouts/historyOrder',{
                    user : user_infor[0],
                    infor_order : infor_order
                })
            }
        }      
    }

    //[GET] /search
    async searchItem(req,res){
        let key_search = req.query.q
        if(key_search === undefined)
            key_search = req.query.manufacturer

        const data = await QueryDatabase.searchItem(key_search)
        const user_token = req.cookies.user_token

        if(user_token == undefined){
            res.render('clientLayouts/search',{
                key_search : key_search,
                items: data
            })
        }
        else{
            const data_user = jwt.verify(user_token,'sositech')
            const user_infor = await QueryDatabase.getAll(`select name, avatar from users where id = ${data_user.id}`)

            res.render('clientLayouts/search',{
                key_search : key_search,
                items: data,
                user : user_infor[0]
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
            const user_infor = await QueryDatabase.getAll(`select name, phone, address, avatar from users where id = ${user_id}`)
            // console.log(user_infor)

            const check = await QueryDatabase.getAll(`select count(*) as count from orders where user_id = ${user_id} and status = 0`)
            // console.log(check[0].count)
            if(check[0].count == 0)
                await QueryDatabase.addNewOrder(user_id)

            const data = await QueryDatabase.getProductInCart(user_id)
            const order_id = await QueryDatabase.getAll(`select id from orders where user_id = ${user_id} and status = 0`)
            // console.log(data)

            let cost = 0

            for(let i=0;i<data.length;i++)
                cost += data[i].quantity * data[i].price

            if(data.length == 0){
                res.render('clientLayouts/cart',{
                    user : user_infor[0]
                })
            }

            else{
                res.render('clientLayouts/cart',{
                    user : user_infor[0],
                    cart : data,
                    order : {
                        id : order_id[0].id,
                        cost : cost
                    }
                })
            }
        }
    }

    //[GET] /profile
    async userProfile(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')

        const data_user = jwt.verify(user_token,'sositech')
        const user_id = data_user.id

        const user_data = await QueryDatabase.getAll(`select name, phone, email, address, avatar from users where id = ${user_id}`)
        // console.log(user_data)

        res.render('clientLayouts/userProfile',{
            user : user_data[0],
            user_data : user_data[0]
        })
    }

    //[GET] /change-password
    async changePassword(req,res){
        res.render('clientLayouts/changePassword')
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
                id : result[0].id
            }, 'sositech', { expiresIn: '2h' })
            
            res.cookie('user_token', token, { expires: new Date(Date.now() + 7200000)})

            res.redirect('/home')
        }
    }


    //[POST] /register
    async registerPOST(req,res){
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const name = req.body.name
        const role = 'client'
        const avatar = '1.png'

        const data = await QueryDatabase.getAll(`select count(*) as countuser from users where phone = '${phone}' or email = '${email}'`)
        
        if(data[0].countuser == 0){
            QueryDatabase.register(name,email,phone,password,'',role,avatar)
            res.redirect('/login')
        }
        else{
            res.cookie("errorRegister",'Tài khoản đã tồn tại', { expires: new Date(Date.now() + 7200000)})
            res.redirect('back')
        }
    }


    //[POST] /logout
    logouPOST(req,res){
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

            const data_check = await QueryDatabase.getAll(`select id,products.quantity as quantity, order_detail.quantity as quantityCart from order_detail, products
            where order_detail.order_id = ${order_id} and order_detail.product_id = products.id`)
            // console.log(data_check)

            let check = true
            for(let i=0;i<data_check.length;i++){
                if(data_check[i].quantity < data_check[i].quantityCart){
                    check = false
                    break
                }
            }

            if(check){
                const time = moment().format("LLL")
                const cost = await QueryDatabase.getCostOrder(order_id)
                // console.log(cost)

                for(let i=0;i<data_check.length;i++){
                    QueryDatabase.updateAsQuery(`update products set quantity = quantity - ${data_check[i].quantityCart} where id = ${data_check[i].id}`)
        
                }

                QueryDatabase.orderItem(order_id,time,cost[0].cost)
                QueryDatabase.addNewOrder(user_id)
            }
            else{
                res.cookie('error-order','1',{ expires: new Date(Date.now() + 7200000)})
            }
        
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

            let id = await QueryDatabase.getAll(`select id from orders where user_id = ${user_id} and status = 0`)

            // console.log(check[0].count)
            if(id.length == 0){
                QueryDatabase.addNewOrder(user_id)
                id = await QueryDatabase.getAll(`select id from orders where user_id = ${user_id} and status = 0`)
            }
            
            const check = await QueryDatabase.getAll(`select * from order_detail where order_id = ${id[0].id} and product_id = ${product_id}`)
            
            if(check.length == 0)
            QueryDatabase.addProductToCart(user_id, product_id, quantity)
            else{
                QueryDatabase.updateAsQuery(`update order_detail set quantity = quantity + ${quantity} where order_id = ${id[0].id}`)
            }
        
            res.redirect('/cart')
        }
    }

    //[POST] /change-profile
    async changeProfile(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')

        const data_user = jwt.verify(user_token,'sositech')
        const user_id = data_user.id

        const name = req.body.name
        const email = req.body.email
        const address = req.body.address

        
        if(req.file != undefined){
            // console.log(req.file)
            const tempPath = req.file.path
            const filename = req.file.filename + '.png'
            fs.rename(tempPath,tempPath+'.png', err => {
                if(err)
                    console.dir(err.message)
            })

            const old_avatar = await QueryDatabase.getAll(`select avatar from users where id = ${user_id}`)
            // console.log(old_avatar)
            // console.log(path.join(__dirname + '../../../public/avatar'))
            if(old_avatar[0].avatar != '1.png'){
                fs.unlink(path.join(__dirname + '../../../public/avatar/' + old_avatar[0].avatar), (err) =>{
                    if(err) console.log('error delete avatar' + err.message)
                })
            }


            QueryDatabase.updateProfile(user_id, name,email, address, filename)
        }
        else{
            QueryDatabase.updateProfileNoAvatar(user_id,name,email,address)
        }
        

        res.redirect('/profile')
    }

    //[POST] /delete-cart/:product_id/:order_id
    async DeleteProductInCart(req,res){
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        const product_id = req.params.product_id
        const order_id = req.params.order_id
        // console.log(product_id)
        
        QueryDatabase.deleteAsQuery(`delete from order_detail where order_id = ${order_id} and product_id = ${product_id}`)
        res.redirect('back')
    }

    //[POST] /change-password
    async changePasswordPOST(req,res) {
        const user_token = req.cookies.user_token
        if(user_token == undefined)
            res.redirect('/login')
        const user_id = jwt.verify(user_token,'sositech').id
        const oldPassword = req.body.oldpassword
        const newPassword = req.body.password

        const check = await QueryDatabase.getAll(`select id from users where id = ${user_id} and password = '${oldPassword}'`)
        // console.log(check)

        if(check.length != 0){
            QueryDatabase.updateAsQuery(`update users set password = '${newPassword}' where id = ${user_id}`)
            res.cookie('successfully-change-password','1',{ expires: new Date(Date.now() + 7200000)})
            res.redirect('back')
        }
        else{
            res.cookie('error-change-password','1',{ expires: new Date(Date.now() + 7200000)})
            res.redirect('back')
        }
    }

}

module.exports = new ClientController