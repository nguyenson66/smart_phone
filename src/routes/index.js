const admin = require('./admin')
const client = require('./client')

function routes(app) {
    app.use('/admin',admin)
    app.use('', client)
}

module.exports = routes