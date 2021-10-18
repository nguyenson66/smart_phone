const QueryDatabase = require('../../config/db')
const jwt = require('jsonwebtoken')

class ClientController{

    /// [GET] :/home
    async home(req,res){
        let page = 0
        if(req.query.page != undefined)
            page = req.query.page
        
        const data = await QueryDatabase.getItem(page)

        res.render('clientLayouts/home',{
            items: data
        })
    }

    //[GET] /login
    login(req,res){
        res.render('clientLayouts/login')
    }

    //[GET] /register
    register(req,res){
        res.render('clientLayouts/register')
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
        res.send('Dang cap nhat')
    }
}

module.exports = new ClientController