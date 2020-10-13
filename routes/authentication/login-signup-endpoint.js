const express = require('express')
const router = express.Router()

const { signUpUser, loginUser } = require('../../controllers/authentication/login-signup')
const { createNewToken } = require('../../controllers/authentication/json-web-token')


//add post requests for API

router.get('/login', async (req, res) => {
    //get form data and send to login handler
    try {
        //email and password
        await loginUser({email: 'test@test.com', password: 'best_password'})
            .then((user) => {
                console.log(user)
                return createNewToken({...user})
            })
            .then((token) => {
                res.cookie('token', token, { maxAge: 999999999})
            })
            .then(() => {
                //redirect here
                res.send("logged in and cookie created.")
            })
        res.send()
    } catch (error) {
        res.send(error)
    }

})

router.get('/signup', async (req, res) => {
    //get form data and send to signup handler
    try {
        await signUpUser({first_name: 'justin', last_name: 'admin', birth_date: 'DOB', phone_number: '604-888-8888', email: 'test@test.com', password: 'best_password'})
            .then((newUser) => {
                console.log(newUser)
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