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
        res.send({error: err.message})
    }
})

//create an error for not authenticated post route.

router.post('/open', protectedPostRoute, async (req, res) => {
    try {
        await db.mongoStart()
        res.send('database connection opened')
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/close', protectedPostRoute, async (req, res) => {
    try {
        await db.mongoClose()
        res.send('database connection closed')
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
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
        res.send({error: err.message})
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
        res.send({error: err.message})
    }  
})

router.post('/update/user', protectedPostRoute, async (req, res) => {
    try {
        //the queried about user
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        //console.log(req.user) //the logged in user

        if (req.body && req.body.user) {
            const user = await db.updateUser({user_id: req.body.user.user_id, updates: req.body.user.updates})
            delete user.password_hash
            if (logging) console.log({queried_user: user, authenticated_user: req.user})
            res.send(user)
        }

    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
    
})

router.post('/read/users', protectedPostRoute, async (req, res) => {
    try {
        const result = await db.getAllUsers()
        if (logging) console.log(result)
        res.send(result)
        
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
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

//for signups, refer to /auth/signup
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
                user_type: req.body.user.user_type
                // leagues: req.body.user.leagues, //add these later, they will be set to empty arrays by default
                // messages: []
            })
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/add/userleague', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        if(req.body && req.body.user) {
            const result = await db.addUserLeague({user_id: req.body.user.user_id, league_id: req.body.user.league_id})
            console.log(result)

            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/userleagues', protectedPostRoute, async (req, res) => {
    try {
        //the queried about user
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        //console.log(req.user) //the logged in user

        if (req.body && req.body.user) {
            const result = await db.getUserLeagues({user_id: req.body.user.user_id})
            if (logging) console.log(result)
            res.send(result)
        }

    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
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
        res.send({error: err.message})
    }
})

router.post('/read/leagues', protectedPostRoute, async (req, res) => {
    try {
            const result = await db.getAllLeagues()
            if (logging) console.log(result)
            res.send(result)
        
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/create/league', protectedPostRoute, async (req, res) => {
    try {
        //console.log(req.body)
        if (!req.body.league) throw new Error(`No league object found. req.body.league was ${req.body.league}`)

        if(req.body && req.body.league) {
            const result = await db.createLeague({
                league_name: req.body.league.league_name,
                phone_number: req.body.league.phone_number,
                email: req.body.league.email,
                sport_type: req.body.league.sport_type,
                headline: req.body.league.headline
            })

            //and automatically join the league!!


            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
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
        res.send({error: err.message})
    }
})

router.post('/read/teams', protectedPostRoute, async (req, res) => {
    try {
        const result = await db.getAllTeams()
        if (logging) console.log(result)
        res.send(result)
        
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/teamplayers', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.team) throw new Error(`No team object found. req.body.team was ${req.body.team}`)

        if (req.body && req.body.team && req.body.team.players) {
            const playerIDsArray =[]
            for (let player in req.body.team.players) {
                playerIDsArray.push(player.user_id)
            }
            const result = await db.getUsersFromTeam(playerIDsArray)
            if (logging) console.log(result)
            res.send(result)
        } else {
            throw new Error(`Ensure req.body.team.players is valid. It was ${req.body.team.players}.`)
        }
        
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/leagueteams', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.league) throw new Error(`No league object found. req.body.league was ${req.body.league}`)

        if (req.body && req.body.league) {
            const result = await db.getTeamsByLeague({league_id: req.body.league.league_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/create/team', protectedPostRoute, async (req, res) => {
    try {
        //console.log(req.body)
        if (!req.body.team) throw new Error(`No team object found. req.body.team was ${req.body.team}`)

        if(req.body && req.body.team) {
            const result = await db.createTeam({
                league_id: req.body.team.league_id,
                team_name: req.body.team.team_name,
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
        res.send({error: err.message})
    }
})

router.post('/update/team', protectedPostRoute, async (req, res) => {
    try {
        //the queried about user
        if (!req.body.team) throw new Error(`No team object found. req.body.team was ${req.body.team}`)

        //console.log(req.user) //the logged in user

        if (req.body && req.body.team) {
            const result = await db.updateTeam({team_id: req.body.team.team_id, updates: req.body.team.updates})
            if (logging) console.log(result)
            res.send(result)
        }

    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
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
        res.send({error: err.message})
    }
})

router.post('/read/arenas', protectedPostRoute, async (req, res) => {
    try {
        const result = await db.getAllArenas()
        if (logging) console.log(result)
        res.send(result)
        
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
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
        res.send({error: err.message})
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
        res.send({error: err.message})
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
        res.send({error: err.message})
    }
})

router.post('/update/match', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.match) throw new Error(`No match object found. req.body.match was ${req.body.match}`)

        if (req.body && req.body.match) {
            const result = await db.updateMatch({match_id: req.body.match.match_id, updates: req.body.match.updates})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/schedule', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.season_schedule) throw new Error(`No schedule object found. req.body.season_schedule was ${req.body.season_schedule}`)

        if (req.body && req.body.season_schedule) {
            const result = await db.getSeasonSchedule({season_schedule_id: req.body.season_schedule.season_schedule_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/create/schedule', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.season_schedule) throw new Error(`No schedule object found. req.body.season_schedule was ${req.body.season_schedule}`)

        if(req.body && req.body.season_schedule) {
            
            const result = await db.createSeasonSchedule({
                league_id: req.body.season_schedule.league_id,
                matches: req.body.season_schedule.matches,
                season_start: req.body.season_schedule.season_start,
                season_end: req.body.season_schedule.season_end,
                season_arenas: req.body.season_schedule.season_arenas
            })

            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/message', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.message) throw new Error(`No message object found. req.body.message was ${req.body.message}`)

        if (req.body && req.body.message) {
            const result = await db.getMessage({message_id: req.body.message.message_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/userMessages', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.user) throw new Error(`No message object found. req.body.user was ${req.body.user}`)

        if (req.body && req.body.user) {
            const result = await db.getUserMessages({user_id: req.body.user.user_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/create/message', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.message) throw new Error(`No message object found. req.body.message was ${req.body.message}`)
        if(!req.body.message.socket_key) throw new Error("Invalid socket_key")

        if(req.body && req.body.message) {
            
            const result = await db.createMessage({
                sender_id: req.body.message.sender_id,
                receivers: req.body.message.receivers, //array of receiver_id s
                message: req.body.message.message, //text
                thumbnail_link: req.body.message.thumbnail_link,
                socket_key: req.body.message.socket_key
            })

            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

module.exports = router