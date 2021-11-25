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
                    if(err) console.dir('err get all: ' +  err.message)
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


    async register(name,email,phone,password,address,role,avatar){
        try {
            await new Promise((resolve,reject) => {
                const query = `insert into users (name,email, password,phone, address,role,avatar) values ('${name}', '${email}','${password}', '${phone}','${address}','${role}','${avatar}')`
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

    addNewOrder(user_id){
        const query = `insert into orders(user_id, status, cost, payment_info, created_at) value(${user_id},0,0,0,'LLL')`
        // console.log(query)
        try {
            con.query(query,(err,result) => {
                if(err)
                    console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    orderItem(order_id,timeOrder,cost){
        let query = `update orders set cost = ${cost}, created_at = '${timeOrder}', status = 1 where id = ${order_id}`
        console.log(query)

        try {
            con.query(query, (err,result) => {
                if(err)
                    console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    addHistoryOrderItem(order_id){
        const query = `update orders set status = 3 where id = ${order_id}`
        // console.log(query)

        con.query(query, (err,result) => {
            if(err)
                console.log(err)
        })
    }

    async deleteOrder(id){

        try {
            let query = `select product_id,quantity from orders where id = ${id}`
            const res = await new Promise((resolve, reject) => {
                con.query(query, (err,result) => {
                    if(err) console.log(err.message)
                    else{
                        resolve(result)
                    }
                })
            })

            const quantity = res[0].quantity
            const product_id = res[0].product_id

            query = `update products set quantity = quantity + ${quantity} where id = ${product_id}`
            con.query(query, (err, result) => {
                if(err) console.log(err.message)
            })

            query = `delete from orders where id = ${id}`
            con.query(query, (err, result) => {
                if(err) console.log(err.message)
            })

        } catch (error) {
            console.dir(error.message)   
        }
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

    pushComment(user_id,product_id, content, time){
        const query = `insert into comments(user_id,product_id, content, created_at) value(${user_id},${product_id},"${content}","${time}")`
        // console.log(query)
        con.query(query, (err,result) => {
            if(err) console.log(err.message)
        })
    }

    getComment(product_id){
        const query = `select name,content,created_at from users,comments where product_id = ${product_id} and user_id = users.id`
        try{
            const res = new Promise((resolve, reject) => {
                con.query(query, (err, result) => {
                    if(err) console.dir(err.message)
                    else{
                        resolve(result)
                    }
                })
            })
            return res
        }catch(err){
            console.dir(err.message)
        }
    }

    addProductToCart(user_id, product_id, quantity){
        const query = `insert into order_detail select id, ${product_id}, ${quantity} from orders where user_id = ${user_id} and status = 0`
        // console.log(query)
        try {
            con.query(query, (err,result) => {
                if(err) console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    getProductInCart(user_id){
        const query = `select products.id, name, image , order_detail.quantity as quantityCart, price, products.quantity as quantity from orders, order_detail, products, images
        where orders.status = 0 and order_detail.order_id = orders.id and orders.user_id = ${user_id} and order_detail.product_id = products.id and products.id = images.product_id
        group by products.id`
        // console.log(query)

        try {
            const res = new Promise((resolve, reject) => {
                con.query(query, (err, result) => {
                    if(err) console.log(err.message)
                    else
                        resolve(result)
                })
            })
            return res
        } catch (error) {
            console.log(error.message)
        }
    }

    getCostOrder(order_id){
        const query = `select sum(order_detail.quantity*products.price) as cost from order_detail, products
        where order_detail.order_id = ${order_id} and order_detail.product_id = products.id`
        console.log(query)

        try {
            const res = new Promise((resolve, reject) => {
                con.query(query,(err,result) => {
                    if(err) console.log('error get cost : ' + err.message)
                    else resolve(result)
                })
            })
            return res
        } catch (error) {
            console.log(error.message)
        }
    }

    addToOrder(order_id, time){
        const query = `update orders set status = 2 where id = ${order_id}`
        // console.log(query)

        con.query(query, (err,result) => {
            if(err)
                console.log('Error add to order : ' + err)
        })
    }
}

module.exports = new QueryDatabase