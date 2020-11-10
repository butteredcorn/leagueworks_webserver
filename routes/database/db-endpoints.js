const express = require('express');
const { protectedPostRoute } = require('../../controllers/authentication/routing');
const router = express.Router()

//initialize db client
//ip address must be whitelisted
const db = require('../../database/mongo-db')
//db.mongoStart()

let logging = true; //global switch

router.get('/*', async (req, res) => {
    try {
        throw new Error("Welcome to the RESTful database API. Please ensure you are logged in and send post requests.")
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

//create an error for not authenticated post route.

router.post('/open', protectedPostRoute, async (req, res) => {
    try {
        await db.mongoStart()
        res.send('database connection opened')
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/close', protectedPostRoute, async (req, res) => {
    try {
        await db.mongoClose()
        res.send('database connection closed')
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

//check for administrator privileges
router.post('/reset', protectedPostRoute, async (req, res) => {
    try {

        const result = await db.resetDatabase()
        if (logging) console.log(result)
        res.send(result)
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
    
})

router.post('/read/user', protectedPostRoute, async (req, res) => {
    try {
        //the queried about user
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        //console.log(req.user) //the logged in user

        if (req.body && req.body.user) {
            const user = await db.getUser({user_id: req.body.user.user_id, email: req.body.user.email})
            delete user.password_hash
            if (logging) console.log({queried_user: user, authenticated_user: req.user})
            res.send(user)
        }

    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
    
})


// fetch('/', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         user: {
//             name: "John",
//             email: "john@example.com"
//         }
//     })
// });

router.post('/create/user', protectedPostRoute, async (req, res) => {
    try {

        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        if(req.body && req.body.user) {
            const result = await db.createUser({
                first_name: req.body.user.first_name,
                last_name: req.body.user.last_name,
                birth_date: req.body.user.birth_date,
                phone_number: req.body.user.phone_number,
                email: req.body.user.email,
                password_hash: req.body.user.password_hash,
                leagues: req.body.user.leagues,
                messages: []
            })
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/read/league', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.league) throw new Error(`No league object found. req.body.league was ${req.body.league}`)

        if (req.body && req.body.league) {
            const result = await db.getLeague({league_id: req.body.league.league_id, email: req.body.league.email})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/create/league', protectedPostRoute, async (req, res) => {
    try {
        //console.log(req.body)
        if (!req.body.league) throw new Error(`No league object found. req.body.league was ${req.body.league}`)

        if(req.body && req.body.league) {
            const result = await db.createLeague({
                league_name: req.body.league.name,
                phone_number: req.body.league.phone_number,
                email: req.body.league.email,
                sport_type: req.body.league.sport_type
            })
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})


router.post('/read/team', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.team) throw new Error(`No team object found. req.body.team was ${req.body.team}`)

        if (req.body && req.body.team) {
            const result = await db.getTeam({team_id: req.body.team.team_id, email: req.body.team.email})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/create/team', protectedPostRoute, async (req, res) => {
    try {
        //console.log(req.body)
        if (!req.body.team) throw new Error(`No team object found. req.body.team was ${req.body.team}`)

        if(req.body && req.body.team) {
            const result = await db.createTeam({
                league_id: req.body.team.league_id,
                phone_number: req.body.team.phone_number,
                email: req.body.team.email,
                captain_id: req.body.team.captain_id,
                players: req.body.team.players
            })
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/read/arena', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.arena) throw new Error(`No arena object found. req.body.arena was ${req.body.arena}`)

        if (req.body && req.body.arena) {
            const result = await db.getArena({arena_id: req.body.arena.arena_id, email: req.body.arena.email})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

//implement
router.post('/create/arena', protectedPostRoute, async (req, res) => {
    try {
        //console.log(req.body)
        if (!req.body.arena) throw new Error(`No arena object found. req.body.arena was ${req.body.arena}`)

        if(req.body && req.body.arena) {
            
            //send data to backend processing function that finds an accurate represenation of the arena through google places, then update the database

            const result = "to be implemented."

            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/read/match', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.match) throw new Error(`No match object found. req.body.match was ${req.body.match}`)

        if (req.body && req.body.match) {
            const result = await db.getMatch({match_id: req.body.match.match_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

router.post('/create/match', protectedPostRoute, async (req, res) => {
    try {
        //console.log(req.body)
        if (!req.body.match) throw new Error(`No match object found. req.body.match was ${req.body.match}`)

        if(req.body && req.body.match) {
            
            const result = await db.createMatch({
                season_id: req.body.match.season_id,
                home_id: req.body.match.home_id,
                away_id: req.body.match.away_id,
                start_time: req.body.match.start_time,
                end_time: req.body.match.end_time,
                arena_id: req.body.match.arena_id
            })

            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send(err.message)
    }
})

module.exports = router