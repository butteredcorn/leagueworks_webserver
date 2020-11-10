const express = require('express')
const router = express.Router()

const { signUpUser, loginUser } = require('../../controllers/authentication/login-signup')
const { createNewToken } = require('../../controllers/authentication/json-web-token')

const { access_token_expiry_in_days } = require('../../globals').authentication

Date.prototype.addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//add post requests for API

router.post('/login', async (req, res) => {
    //get form data and send to login handler
    try {
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        if (req.body && req.body.user) {
            //email and password ie. test@test.com / best_password
            await loginUser({email: req.body.user.email, password: req.body.user.password})
            .then(async (user) => {
                //move this logic to json-web-token.js
                delete user.password_hash
                const today = new Date();
                const token_expiry = today.addDays(access_token_expiry_in_days)
                user.token_expiry = token_expiry //need to refresh token expiry for logged-in activity

                // console.log(user)
                const accessToken = await createNewToken({...user})
                return {'access_token': accessToken, 'expiry': token_expiry}
            })
            .then((token) => {
                res.send(token)
            })
        } else {
            throw new Error("Ensure request is sent in req.body.")
        } 
    } catch (err) {
        res.send(err.message)
    }

})

router.post('/signup', async (req, res) => {
    //get form data and send to signup handler
    try {
        if (!req.body.user) throw new Error(`No user object found. req.body.user was ${req.body.user}`)

        if (req.body && req.body.user) {
            await signUpUser({first_name: req.body.user.first_name, last_name: req.body.user.last_name, birth_date: req.body.user.birth_date, phone_number: req.body.user.phone_number, email: req.body.user.email, password: req.body.user.password})
            .then(async (user) => {
                //move this logic to json-web-token.js
                delete user.password_hash
                const today = new Date();
                const token_expiry = today.addDays(access_token_expiry_in_days)
                user.token_expiry = token_expiry //need to refresh token expiry for logged-in activity

                // console.log(user)
                const accessToken = await createNewToken({...user})
                return {'access_token': accessToken, 'expiry': token_expiry}
            })
            .then((token) => {
                res.send(token)
            })
        } else {
            throw new Error("Ensure request is sent in req.body.")
        }
    } catch (err) {
        res.send(err.message)
    }
})

// router.get('/login', async (req, res) => {
//     //get form data and send to login handler
//     try {
//         //email and password
//         await loginUser({email: 'test@test.com', password: 'best_password'})
//             .then((user) => {
//                 console.log(user)
//                 return createNewToken({...user})
//             })
//             .then((token) => {
//                 res.cookie('access_token', token, { maxAge: 999999999})
//             })
//             .then(() => {
//                 //redirect here
//                 res.send("logged in and cookie created.")
//             })
//         res.send()
//     } catch (error) {
//         res.send(error)
//     }
// })

// router.get('/signup', async (req, res) => {
//     //get form data and send to signup handler
//     try {
//         await signUpUser({first_name: 'justin', last_name: 'admin', birth_date: 'DOB', phone_number: '604-888-8888', email: 'test@test.com', password: 'best_password'})
//             .then((newUser) => {
//                 console.log(newUser)
//                 return createNewToken({...newUser})
//             })
//             .then((token) => {
//                 res.cookie('access_token', token, { maxAge: 999999999})
//             })
//             .then(() => {
//                 //redirect here
//                 res.send("signed up and cookie created.")
//             })
//     } catch (error) {
//         res.send(error)
//     }
// })

module.exports = router