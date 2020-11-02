const express = require('express')
const router = express.Router()

//initialize db client
//ip address must be whitelisted
const db = require('../../database/mongo-db')
//db.mongoStart()

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
        console.log(result)
        res.send(result)
    } catch (error) {
        if(error) {
            res.send(error)
        }
    }
})

router.post('/getUser', async (req, res) => {
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

module.exports = router