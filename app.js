module.exports = function () {
    const express = require('express')
    require('dotenv').config()
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const { verifyExistingToken } = require('./controllers/authentication/json-web-token')

    //wrap server in io
    const app = express()
    const server = require('http').createServer(app)
    const io = require('socket.io')(server);

    //set middleware
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser())
    app.use(express.json())

    //sets routes
    const loginSignUpRoute = require('./routes/authentication/login-signup-endpoint')
    const googleCalendarRoute = require('./routes/calendar/google-calendar')
    const databaseRoute = require('./routes/database/db-endpoints')
    const apiRoute = require('./routes/api')

    app.use('/auth', loginSignUpRoute)
    app.use('/api/calendar', googleCalendarRoute)
    app.use('/database', databaseRoute)
    app.use('/api', apiRoute)


    //io logic
    io.use(async (socket, next) => {
        try {
            //console.log(socket.handshake.query)
            console.log(socket.handshake.query)
            // if (socket.handshake.query && socket.handshake.query.token) {
            //     console.log(socket.handshake.query)
            //     //check for jwt token
            //     // const jwt = (socket.handshake.query.token).replace('access_token=', '')
            //     // const user = await verifyExistingToken(jwt)
            // } else {
            //     throw new Error(`socket.handshake.query error. socket.handshake.query.token was ${socket.handshake.query.token}`)
            // }
            next()
        } catch (err) {
            console.log(err)
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit("connection", "Hello from the server.")

        socket.on('react message', (message) => {
            console.log(message)
        })

        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
      });

    //remaining general server logic
    app.get('/test', async (req, res) => {
        try {
            res.send('test okay.')
        } catch (error) {
            res.send(error)
        }
    })

    return server
}