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

    const db = require('./database/mongo-db')
    const {signUpUser} = require('./controllers/authentication/login-signup')
    const {createNewToken} = require('./controllers/authentication/json-web-token')


    app.get('/database/reset', async (req, res) => {
        try {
            const result = await db.resetDatabase()
            console.log(result)
            res.send(result)
        } catch (error) {
            if(error) {
                res.send(error)
            }
        }
    })

    app.get('/database/getUser', async (req, res) => {
        try {
            const user = await db.getUserByEmail({email: 'test@test.com'})
            console.log(user)
            res.send(user)
        } catch (error) {
            if(error) {
                res.send(error)
            }
        }
    })

    app.get('/database/createUser', async (req, res) => {
        try {
            //await db.createUser({first_name: 'justin', last_name: 'admin', birth_date: 'DOB', phone_number: '604-888-8888', email: 'test@test.com', password: 'best_password'})
            await signUpUser({first_name: 'justin', last_name: 'admin', birth_date: 'DOB', phone_number: '604-888-8888', email: 'test@test.com', password: 'best_password'})
            .then((newUser) => {
                return createNewToken({...newUser})
            })
            .then((token) => {
                res.cookie('token', token, { maxAge: 999999999})
            })
            .then(() => {
                res.send("signed up and cookie created.")
            })
        } catch (error) {
            if(error) {
                res.send(error)
            }
        }
    })

    app.get('/api/calendar-test', async (req, res) => {
        try {
            const {createNewEvent} = require('./controllers/google-calendar')

            //the event object
            //import data from front end ie. form to declare eventStartTime and eventEndTime
            const eventStartTime = new Date()
            const eventEndTime = new Date()
            const timeZone = 'America/Vancouver'
            const defaultColorID = 1


            //`eventStartTime.getDay() + 2` sets the day for tomorrow
            eventStartTime.setDate(eventStartTime.getDay() + 2)

            //we will make the end time end 1 hour later
            eventEndTime.setDate(eventEndTime.getDay() + 2)
            eventEndTime.setMinutes(eventEndTime.getMinutes() + 60)

            const theEvent = {
                summary: "Basketball Game",
                location: "6260 Killarney St, Vancouver, BC V5S 2X7",
                description: "Basketball Game between the Lakers and Nuggets.",
                colorId: defaultColorID, //there are 11 different colorIDs
                start: {
                    dateTime: eventStartTime, //equal to date and time
                    timeZone: timeZone//standard javascript timezone
                },
                end: {
                    dateTime: eventEndTime,
                    timeZone: timeZone
                }
            }
            createNewEvent(theEvent)

            res.send("complete.")
        } catch (error) {
            console.log(error)
        }
    })

    return server
}