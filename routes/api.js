const express = require('express')
const router = express.Router()
const util = require('util')


const { logging } = require('../globals')
const { google_places } = require('../globals').google_urls //takes a placeID
const { getPlaceDetailsRaw, getArenasByIDs } = require('../controllers/google-places')


router.get('/match', async (req, res) => {
    try {
        const { matchTeams } = require('./controllers/scheduling/match-teams')
        res.send(matchTeams())
    } catch (err) {
        if(logging) console.log(err)
        res.send(err)
    } 
})

router.post('/place', async (req, res) => {
    try {        
        //pull places_id from the front end
        if(req.body && req.body.arena.arena_id) {
            const url = google_places(req.body.arena.arena_id)
            const details = await getPlaceDetailsRaw(url)
            console.log(details.data)
            const result = {
                place_id: req.body.arena.arena_id,
                url: url,
                details: details.data
            }
            console.log(util.inspect(result, false, null, true))
            res.send(result)
        }
        
    } catch (err) {
        if(logging) console.log(err)
        res.send(err)
    } 
})

router.get('/places', async (req, res) => {
    try {
        //local storage of arenaIDs
        const arenaIDs = require('../database/assets/google-place-id')

        const result = await getArenasByIDs(arenaIDs)
        console.log(util.inspect(result, false, null, true))
        res.send(result)
    } catch (err) {
        if(logging) console.log(err)
        res.send(err)
    } 
})

module.exports = router