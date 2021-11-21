const express = require('express')
const routes = require('./routes')
const exphb = require('express-handlebars')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded( {extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

// set express-handlebars
app.engine('hbs',exphb({extname : '.hbs'}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname + '/views'))

// set view engine Pug
// app.set('view engine', 'pug')
// app.set('views',path.join(__dirname+'/views'))


////// All routes web ////////
routes(app)

app.listen(3000, () => {
    console.log('server is running')
})