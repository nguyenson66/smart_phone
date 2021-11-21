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
        const query = 'select id, name ,price,quantity,manufacturer,description,image from products,images where images.product_id = products.id group by id limit 20 offset ' + page*20
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
                const query = `insert into products (name, description, price, quantity, manufacturer) values( '${name}', '${description}', '${price}', '${quantity}', '${manufacturer}')`
                // console.log(query)
                con.query(query, (err,result) => {
                    if(err) console.dir(err.message)
                    else{
                        con.query("SELECT LAST_INSERT_ID() as id;", (err,result) => {
                            // console.log("last id : " + result)
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
                const query = `insert into images values (${id}, '${filename}')`
                console.log(query)
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


    async register(name,email,phone,password,address,role){
        try {
            await new Promise((resolve,reject) => {
                const query = `insert into users (name,email, password,phone, address,role) values ('${name}', '${email}','${password}', '${phone}','${address}','${role}')`
                console.log(query)
                con.query(query, (err,result) => {
                    if(err)
                        console.log(err.message)
                })
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    orderItem(user_id, product_id, quantity, timeOrder){
        const query = `insert into orders (user_id, product_id,quantity, status, created_at) values (${user_id},${product_id},${quantity},0,'${timeOrder}')`
        // console.log(query)

        con.query(query, (err,result) => {
            if(err)
                console.log(err)
        })
    }

    addHistoryOrderItem(order_id, timeOrder){
        const query = `update orders set status = 1, created_at = "${timeOrder}" where id = ${order_id}`
        console.log(query)

        con.query(query, (err,result) => {
            if(err)
                console.log(err)
        })
    }

    deleteOrder(id){
        const query = `delete from orders where id = ${id}`
        con.query(query, (err, result) => {
            if(err) console.log(err.message)
        })
    }

    async getAllOrder(){
        const query = `select orders.id as id, user_id, product_id, 
        ( select name from products where products.id = product_id) as name , orders.quantity, created_at
        from orders
        where status = 0
        group by orders.id`

        try {
            const res = await new Promise((resolve, reject) => {

                con.query(query, (err, result) => {
                    if(err) console.log(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        } catch (error) {
            console.log(error.message)
        }
    }

    deleteItem(product_id){
        let query = `delete from images where product_id = ${product_id}`
        // console.log(query)
        con.query(query, (err,result) => {
            if(err) console.log(err.message)
        })

        query = `delete from products where id = ${product_id}`
        // console.log(query)
        con.query(query, (err,result) => {
            if(err) console.log(err.message)
        })
    }

    async searchItem(text){
        const query = `select id, name ,price,quantity,manufacturer,description,image from products,images 
        where match(name) against('${text}') and images.product_id = products.id group by id`

        try{
            const res = new Promise((resolve, reject) => {
                con.query(query, (err, result) =>{
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        }catch(error){
            console.dir(error.message)
        }
    }
}

module.exports = new QueryDatabase