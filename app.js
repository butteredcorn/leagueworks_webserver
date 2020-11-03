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

    const { google_places } = require('./globals').google_urls //takes a placeID
    const { getPlaceDetails } = require('./controllers/google-places')
    const { killarney_community_center } = require('./database/assets/google-place-id')

    app.use('/auth', loginSignUpRoute)
    app.use('/api/calendar', googleCalendarRoute)
    app.use('/database', databaseRoute)

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

    return server
}