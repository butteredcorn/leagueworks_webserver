
module.exports = function () {
    const express = require('express')
    require('dotenv').config()
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const { verifyExistingToken } = require('./controllers/authentication/json-web-token')

    const db = require('./database/mongo-db')

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
            if (socket.handshake.query && socket.handshake.query.token) {
                //check for jwt token
                const jwt = socket.handshake.query.token
                const user = await verifyExistingToken(jwt)

                if (user) {
                    socket.user = user
                    socket.otherUserID = socket.handshake.query.other_user_id
                    next()
                } else {
                    next(new Error('Authentication error.'))
                }
            } else {
                next(new Error(`socket.handshake.query error. socket.handshake.query.token was ${socket.handshake.query.token}`))
            }
        } catch (err) {
            console.log(err)
        }
    })

    const users = {} //dictionary of online sockets

    io.on('connection', async (socket) => {
        console.log('a user connected');
        //console.log(socket.user)
        //console.log(socket.otherUserID)
        users[socket.user._id] = socket //save socket to diciontary
        socket.emit("connection", [{user_id: socket.user._id, other_user_id: socket.otherUserID, message: "connected to messaging server"}])

        //order matters, also need unique
        const socketKey = JSON.stringify([socket.user._id, socket.otherUserID].sort())
        //join current user to private room
        users[socket.user._id].join(socketKey)

        try { //to load old messages
            const messageHistory = await db.getMessagesBySocketKey({socket_key: socketKey})
            if (messageHistory.length == 0) { //no old messages
                socket.emit('old messages', [{history: null}])
            } else {
                socket.emit('old messages', messageHistory)
            }
        } catch (err) {
            //load message err
            console.log(err)
        }

        socket.on('new message', async (message) => {
            if(message && message.message) {
                console.log(message)
                const result = await db.createMessage({sender_id: message.sender_id, receivers: message.receivers, message: message.message, thumbnail_link: message.thumbnail_link, socket_key: socketKey})
                io.sockets.in(socketKey).emit('new message', {sender_id: message.sender_id, receivers: message.receivers, message: message.message, thumbnail_link: message.thumbnail_link, socket_key: socketKey})
                console.log(result)
            }
        })

        socket.on('disconnect', () => {
          console.log('user disconnected');
          delete users[socket.user._id]
          console.log(`Remaining online sockets: ${Object.keys(users)}.`)
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