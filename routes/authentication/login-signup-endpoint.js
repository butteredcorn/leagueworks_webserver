const express = require('express')
const router = express.Router()

const client = require('../../database/mongo-db').client
const { signUpUser, loginUser } = require('../../controllers/authentication/login-signup')
const { createNewToken } = require('../../controllers/authentication/json-web-token')


router.get('/login', async (req, res) => {
    //get form data and send to login handler

    try {
        res.send(await loginUser('test@test.com'))
    } catch (error) {
        res.send(error)
    }

})

router.get('/signup', async (req, res) => {
    //get form data and send to signup handler
    try {
        await signUpUser({first_name: 'justin', last_name: 'admin', birth_date: 'DOB', phone_number: '604-888-8888', email: 'test@test.com', password: 'best_password'})
            .then((newUser) => {
                return createNewToken({...newUser})
            })
            .then((token) => {
                res.cookie('token', token, { maxAge: 999999999})
            })
            .then(() => {
                //redirect here
                res.send("signed up and cookie created.")
            })
    } catch (error) {
        res.send(error)
    }
})

module.exports = router