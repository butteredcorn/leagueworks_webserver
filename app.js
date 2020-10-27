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

    //initialize db client
    //ip address must be whitelisted
    const db = require('./database/mongo-db')
    //db.mongoStart()

    const loginSignUpRoute = require('./routes/authentication/login-signup-endpoint')
    const googleCalendarRoute = require('./routes/calendar/google-calendar')

    const { google_places } = require('./globals').google_urls //takes a placeID
    const { getPlaceDetails } = require('./controllers/google-places')
    const { killarney_community_center } = require('./database/assets/google-place-id')

    app.use('/auth', loginSignUpRoute)
    app.use('/api/calendar', googleCalendarRoute)

    app.get('/database/close', async (req, res) => {
        try {
            await db.mongoClose()
            res.send('database connection closed')
        } catch (error) {
            res.send(error)
        }
    })

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

    app.get('/test', async (req, res) => {
        try {
            res.send('test okay.')
        } catch (error) {
            res.send(error)
        }
    })

    app.get('/api/match', async (req, res) => {
        try {
            const { matchTeams } = require('./controllers/scheduling/match-teams')
            res.send(matchTeams())
        } catch (error) {
            console.log(error)
            res.send(error)
        } 
    })

    app.get('/api/places', async (req, res) => {
        try {
            //pull places_id from the front end
            const details = await getPlaceDetails(google_places(killarney_community_center.id))
            console.log(details.data)
            // {
            //     html_attributions: [],
            //     result: {
            //       formatted_address: '6260 Killarney St, Vancouver, BC V5S 2X7, Canada',
            //       formatted_phone_number: '(604) 718-8200',
            //       geometry: { location: [Object], viewport: [Object] },
            //       name: 'Killarney Community Centre',
            //       photos: [
            //         [Object], [Object],
            //         [Object], [Object],
            //         [Object], [Object],
            //         [Object], [Object],
            //         [Object], [Object]
            //       ],
            //       rating: 4.3
            //     },
            //     status: 'OK'
            //   }
            const result = {
                place_id: killarney_community_center.id,
                url: google_places(killarney_community_center.id),
                details: details.data
            }
            console.log(result)
            res.send(result)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // app.get('/api/calendar-test', async (req, res) => {
    //     try {
    //         const {createNewEvent} = require('./controllers/google-calendar')

    //         //the event object
    //         //import data from front end ie. form to declare eventStartTime and eventEndTime
    //         const eventStartTime = new Date()
    //         const eventEndTime = new Date()
    //         const timeZone = 'America/Vancouver'
    //         const defaultColorID = 1


    //         //`eventStartTime.getDay() + 2` sets the day for tomorrow
    //         eventStartTime.setDate(eventStartTime.getDay() + 2)

    //         //we will make the end time end 1 hour later
    //         eventEndTime.setDate(eventEndTime.getDay() + 2)
    //         eventEndTime.setMinutes(eventEndTime.getMinutes() + 60)

    //         const theEvent = {
    //             summary: "Basketball Game",
    //             location: "6260 Killarney St, Vancouver, BC V5S 2X7",
    //             description: "Basketball Game between the Lakers and Nuggets.",
    //             colorId: defaultColorID, //there are 11 different colorIDs
    //             start: {
    //                 dateTime: eventStartTime, //equal to date and time
    //                 timeZone: timeZone//standard javascript timezone
    //             },
    //             end: {
    //                 dateTime: eventEndTime,
    //                 timeZone: timeZone
    //             }
    //         }
    //         createNewEvent(theEvent)

    //         res.send("complete.")
    //     } catch (error) {
    //         console.log(error)
    //     }
    // })

    return server
}