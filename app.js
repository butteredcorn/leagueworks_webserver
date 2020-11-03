module.exports = function () {
    const express = require('express')
    require('dotenv').config()
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')

    const app = express()
    const server = require('http').createServer(app)

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser())
    app.use(express.json())


    const loginSignUpRoute = require('./routes/authentication/login-signup-endpoint')
    const googleCalendarRoute = require('./routes/calendar/google-calendar')
    const databaseRoute = require('./routes/database/db-endpoints')
    const apiRoute = require('./routes/api')

    app.use('/auth', loginSignUpRoute)
    app.use('/api/calendar', googleCalendarRoute)
    app.use('/database', databaseRoute)
    app.use('/api', apiRoute)

    app.get('/test', async (req, res) => {
        try {
            res.send('test okay.')
        } catch (error) {
            res.send(error)
        }
    })

    return server
}