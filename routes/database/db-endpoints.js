const express = require('express')
const router = express.Router()

//initialize db client
//ip address must be whitelisted
const db = require('../../database/mongo-db')
//db.mongoStart()

let logging = true;

router.post('/open', async (req, res) => {
    try {
        await db.mongoStart()
        res.send('database connection opened')
    } catch (error) {
        res.send(error)
    }
})

router.post('/close', async (req, res) => {
    try {
        await db.mongoClose()
        res.send('database connection closed')
    } catch (error) {
        res.send(error)
    }
})

router.post('/reset', async (req, res) => {
    try {

        const result = await db.resetDatabase()
        if (logging) console.log(result)
        res.send(result)
    } catch (error) {
        if(error) {
            res.send(error)
        }
    }
})

router.post('/read/user', async (req, res) => {
    try {

        const user = await db.getUserByEmail({email: 'test@test.com'})
        if (logging) console.log(user)
        res.send(user)
    } catch (error) {
        if(error) {
            res.send(error)
        }
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

router.post('/create/user', async (req, res) => {
    try {

        if (!req.body.user) res.send(new Error(`No user object found. req.body.user was ${req.body.user}`))

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
    } catch (error) {
        if(error) {
            res.send(error)
        }
    }
})

router.post('/read/league', async (req, res) => {
    try {

        const user = await db.getLeague({email: 'test@test.com'})
        if (logging) console.log(user)
        res.send(user)
    } catch (error) {
        if(error) {
            res.send(error)
        }
    }
})

router.post('/create/league', async (req, res) => {
    try {
        //console.log(req.body)

        if (!req.body.league) res.send(new Error(`No league object found. req.body.league was ${req.body.league}`))

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
    } catch (error) {
        if(error) {
            res.send(error)
        }
    }
})

module.exports = router