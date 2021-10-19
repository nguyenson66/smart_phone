const QueryDatabase = require('../../config/db')
const jwt = require('jsonwebtoken')

class ClientController{

    /// [GET] :/home
    async home(req,res){
        let page = 0
        if(req.query.page != undefined)
            page = req.query.page
        
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
        const data = await QueryDatabase.getAll('select name,description,price,quantity,manufacturer from items where id = ' + id)
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
                image : image_item,
                user : username
            })
        }
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

            res.cookie('user_token', token, { expiresIn: '2h' })
            res.cookie('username',result[0].name, { expiresIn: '2h' })

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


}

module.exports = new ClientController