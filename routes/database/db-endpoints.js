const express = require('express');
const { protectedPostRoute } = require('../../controllers/authentication/routing');
const router = express.Router()

//initialize db client
//ip address must be whitelisted
const ObjectID = require('mongodb').ObjectID;
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

router.post('/read/userSchedules', protectedPostRoute, async (req, res) => {
    try {
        //the queried about user
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        //console.log(req.user) //the logged in user

        if (req.body && req.body.user) {
            const result = await db.getUserSchedules({user_id: req.body.user.user_id})
            if (logging) console.log(result)
            res.send(result)
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
                thumbnail_link: req.body.user.thumbnail_link,
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
                headline: req.body.league.headline,
                thumbnail_link: req.body.league.thumbnail_link
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

router.post('/read/teamsplayers', protectedPostRoute, async (req, res) => {
    try {

        if (!req.body.teams) throw new Error(`No team object found. req.body.teams was ${req.body.teams}`)

        if (req.body && req.body.teams) {
            const teamsObj = {}

            for (let team of req.body.teams.teams) {
                const playersIDs = []
                for (let player of team.players) {
                    playersIDs.push(ObjectID(player.user_id))
                }
                teamsObj[team._id] = playersIDs
            }

            console.log(teamsObj) //{ '5fba0cf1ddbf920017904071': [ 5fb9b41bf474710017f1ffc8 ] }
            
            for (let key in teamsObj) {

                console.log({players: teamsObj[key]})

                const playersArray = await db.getUsersFromTeam({players: teamsObj[key]})
                teamsObj[key] = playersArray
            }
            if (logging) console.log(teamsObj)
            res.send(teamsObj)
        } else {
            throw new Error(`Ensure req.body.team.players is valid. It was ${req.body.team.players}.`)
        }
        
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
            for (let player of req.body.team.players) {
                playerIDsArray.push(ObjectID(player.user_id))
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
        if (!req.body.team) throw new Error(`No team object found. req.body.team was ${req.body.team}`)

        if(req.body && req.body.team) {
            const result = await db.createTeam({
                league_id: req.body.team.league_id,
                team_name: req.body.team.team_name,
                phone_number: req.body.team.phone_number,
                email: req.body.team.email,
                captain_id: req.body.team.captain_id,
                players: req.body.team.players,
                thumbnail_link: req.body.team.thumbnail_link
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

router.post('/read/arenaByName', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.arena) throw new Error(`No arena object found. req.body.arena was ${req.body.arena}`)

        if (req.body && req.body.arena) {
            const result = await db.getArenaByName({name: req.body.arena.name})
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

        //match updates
        const updates = {season_id: req.body.match.update.season_id}

        if (req.body && req.body.match && req.body.match.update) {
            
            //format front end request data
            if (req.body.match.update.arena) {
                updates.arena = req.body.match.update.arena
            }
            if (req.body.match.update.start_date) {
                updates.start_date = req.body.match.update.start_date
            }
            if (req.body.match.update.match_result) {
                const match_result = req.body.match.update.match_result
                if (match_result.home_team_win && match_result.away_team_win) {
                    //this is a tie
                    updates.match_tied = true
                } else if (match_result.home_team_win) {
                    updates.winner_id = match_result.home_team
                    updates.loser_id = match_result.away_team
                } else if (match_result.away_team_win) {
                    updates.winner_id = match_result.away_team
                    updates.loser_id = match_result.home_team
                }
            }

            //call update match
            const matchUpdateResult = await db.updateMatch({match_id: req.body.match.match_id, updates: updates})
            
            //need to update two things, the schedule of events, and the individual match itself
            const currentSeason = await db.getSeasonSchedule({season_id: req.body.match.update.season_id})
            for (let event of currentSeason.events) {
                if (event.match_id == req.body.match.match_id) {
                    if (req.body.match.update.arena) {
                        event.arena = req.body.match.update.arena
                    }
                    if (req.body.match.update.start_date) {
                        event.start_date = req.body.match.update.start_date
                    }
                    if (req.body.match.update.match_result) {
                        const match_result = req.body.match.update.match_result
                        if (match_result.home_team_win && match_result.away_team_win) {
                            //this is a tie
                            event.match_tied = true
                        } else if (match_result.home_team_win) {
                            event.winner_id = match_result.home_team
                            event.loser_id = match_result.away_team
                        } else if (match_result.away_team_win) {
                            event.winner_id = match_result.away_team
                            event.loser_id = match_result.home_team
                        }
                    }
                    break;
                }
            }

            const updateSeasonResult = await db.updateEventInSeasonSchedule({season_id: req.body.match.update.season_id, events: currentSeason.events})

            if (logging) console.log(matchUpdateResult)
            if (logging) console.log(updateSeasonResult)
            res.send(updateSeasonResult)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/schedule', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.season) throw new Error(`No schedule object found. req.body.season was ${req.body.season}`)

        if (req.body && req.body.season) {
            const result = await db.getSeasonSchedule({season_id: req.body.season.season_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/leagueSchedule', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.league) throw new Error(`No league object found. req.body.league was ${req.body.league}`)

        if (req.body && req.body.league) {
            const result = await db.getScheduleByLeague({league_id: req.body.league.league_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/latestLeagueSchedule', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.league) throw new Error(`No league object found. req.body.league was ${req.body.league}`)

        if (req.body && req.body.league) {
            const result = await db.getLatestLeagueSeason({league_id: req.body.league.league_id})
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
        if (!req.body.season) throw new Error(`No schedule object found. req.body.season was ${req.body.season}`)

        //get league teams
        //calculate season end date - provide optional override later
        //need to think about season arenas
        const checkGameDaysError = (match_days) => {
            let error = true;
            for (let day in match_days) {
                if (match_days[day]) {
                    error = false;
                    break; //ensure at least one day has been selected
                }
            }
            return error;
        }

        if(req.body && req.body.season && req.body.season.match_days) {
            if(checkGameDaysError(req.body.season.match_days)) throw new Error(`At least one day in the week must be set to true. It was ${req.body.season.match_days}.`)
            if(checkGameDaysError(req.body.season.match_day_arenas)) throw new Error(`Chosen game days must have arenas. It was ${req.body.season.match_day_arenas}.`)
            if(req.body.season.match_number == 0) throw new Error(`match_number cannot be zero.`)
            if(req.body.season.match_sets_per_week < 1) throw new Error(`match_sets_per_week cannot be less than 1.`)

            const {generateSeasonSchedule} = require('../../controllers/scheduling/create-schedule')

            const result = await generateSeasonSchedule(req.body.season)
            result.league_id = req.body.season.league_id
            result.season_arenas = req.body.season.match_day_arenas

            for(let event of result.events) {
                const {summary, home_team, home_team_players, away_team, away_team_players, start_date, arena} = event
                const match = await db.createMatch({summary, home_team, home_team_players, away_team, away_team_players, start_date, arena})
                event.match_id = match[0]._id
                event.season_id = result._id
            }

            console.log(result.events)

            // console.log(req.body.season)
            
            const databaseResult = await db.createSeasonSchedule({league_id: result.league_id, start_date: result.start_date, end_date: result.end_date, game_days: result.game_days, match_sets: result.match_sets, game_dates: result.game_dates, events: result.events, season_arenas: result.season_arenas, skip_holidays: req.body.season.skip_holidays})
            //console.log(databaseResult)

            if (logging) console.log(databaseResult)
            res.send(databaseResult)
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

router.post('/read/post', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.post) throw new Error(`No post object found. req.body.post was ${req.body.post}`)

        if (req.body && req.body.post) {
            const result = await db.getPost({post_id: req.body.post.post_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/posts', protectedPostRoute, async (req, res) => {
    try {
        const result = await db.getAllPosts()
        if (logging) console.log(result)
        res.send(result)
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/read/userposts', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        if (req.body && req.body.user) {
            const result = await db.getUserPosts({user_id: req.body.user.user_id})
            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/create/post', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.post) throw new Error(`No post object found. req.body.post was ${req.body.post}`)

        if(req.body && req.body.post) {
            
            const result = await db.createPost({
                user_id: req.body.post.user_id,
                title: req.body.post.title,
                description: req.body.post.description,
                thumbnail_link: req.body.post.thumbnail_link,
                likes: [],
                league_id: req.body.post.league_id,
                username: req.body.post.username,
                user_profile_thumbnail: req.body.post.user_profile_thumbnail
            })

            if (logging) console.log(result)
            res.send(result)
        }
    } catch (err) {
        if(logging) console.log(err.message)
        res.send({error: err.message})
    }
})

router.post('/like/post', protectedPostRoute, async (req, res) => {
    try {
        if (!req.body.post) throw new Error(`No post object found. req.body.post was ${req.body.post}`)

        if(req.body && req.body.post) {
            
            const result = await db.likePost({
                user_id: req.body.post.user_id,
                post_id: req.body.post.post_id
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