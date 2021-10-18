const { query } = require('express')
const mysql = require('mysql')

const con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'admin',
    database : 'cosodulieubtl'
})

con.connect(function(err) {
    if(err) console.dir(err.message)
    console.log('db ' + con.state)
})

class QueryDatabase{

    /// get item by page
    async getItem(page){
        const query = 'select id, name ,price,quantity,manufacturer,description,image from items,images where images.item_id = items.id group by id limit 20 offset ' + page*20
        try {
            const res = await new Promise((resolve, reject) => {
                con.query(query, function(err,result) {
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        } catch (error) {
            console.dir(error.message)
        }
    }

    async getAll(query){
        try {
            const res = await new Promise((resolve, reject) => {
                con.query(query, function(err,result) {
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        } catch (error) {
            console.dir(error.message)
            return ''
        }
    }

    async login(username,password){
        try {
            const res = await new Promise((resolve, reject) => {
                const query = "select id,name from users where phone = '" + username + "' and password = '" + password + "';"
                con.query(query, function(err,result) {
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
        } catch (error) {
            console.dir(error.message)
        }
    }

    async getRole(id){
        try {
            const res = await new Promise((resolve,reject) => {
                const query = "select role from users where id = '" + id + "';"
                con.query(query, (err, result) => {
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        } catch (error) {
            console.dir(error.message)
        }
    }

    async addItem(body){
        const name = body.name
        const description = body.description
        const manufacturer = body.manufacturer
        const price = body.price
        const quantity = body.quantity

        try {
            const res = await new Promise((resolve, reject) => {
                const query = `insert into items (name, description, price, quantity, manufacturer) values( '${name}', '${description}', '${price}', '${quantity}', '${manufacturer}')`
                // console.log(query)
                con.query(query, (err,result) => {
                    if(err) console.dir(err.message)
                    else{
                        con.query("SELECT LAST_INSERT_ID() as id;", (err,result) => {
                            if(err) console.dir(err.message)
                            else{
                                resolve(result)
                            }
                        })
                    }
                })
            })
            return res
        } catch (error) {
            console.dir(error.message)
        }
    }


    async addImage(id, filename){
        try {
            const res = await new Promise((resolve, reject) => {
                const query = `insert into images (item_id, image) values (${id}, '${filename}')`
                // console.log(query)
                con.query(query, (err, result) => {
                    if(err){ 
                        console.dir(err.message)
                        resolve({'status' : 500})
                    }
                    else resolve({'status' : 200})
                })
            })
            return res
        } catch (error) {
            console.dir(error.message)
        }
    }

    async login(phone,password){
        try {
            const res = await new Promise((resolve, reject) => {
                const query = `select id, name from users where phone = '${phone}' and password = '${password}'`
                con.query(query, (err,result) => {
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        } catch (error) {
            console.dir(error.message)
        }
    }


    async history(adminId, itemId, time){
        try {
            await new Promise((resolve,reject) => {
                const query = `insert into import_management (admin_id, item_id, created_at) values (${adminId}, ${itemId}, '${time}')`
                // console.log(query)
                con.query(query, (err,result) => {
                    if(err) console.dir(err.message)
                })
            })
        } catch (error) {
            console.dir(err.message)
        }
    }
}

module.exports = new QueryDatabase