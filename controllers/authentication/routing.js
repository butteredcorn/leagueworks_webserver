const verify = require('./json-web-token').verifyExistingToken
const loginPage = '/login'
const indexPage = '/'

// const protectedRoute = (req, res, next) => {
//     //if token exists
//     if(req.cookies && req.cookies.access_token) {
//         verify(req.cookies.access_token)
//             .then((user) => {
//                 //bind user to request object
//                 req.user = user
//                 next()
//             })
//             .catch((error) => {
//                 console.log(error)
//                 res.redirect(loginPage)
//             })
//     } else {
//         //authentication failed
//         res.redirect(loginPage)
//     }       
// }

const protectedPostRoute = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(req.body)
            if (req.body.access_token) {
                verify(req.body.access_token)
                    .then((user) => {
                        //should also check if user exists in database?
                        delete user.password_hash
                        const date = new Date(this.valueOf());
                        console.log(user)
                        if (!user.token_expiry || user.token_expiry < date.getDate()) throw new Error('Token expired.')
                        req.user = user //the logged in user
                        resolve(next())
                    }).catch((err) => res.send(err.message))
                    
            } else {
                throw new Error('access_token not found.')
            }
        } catch (err) {
            res.send(err.message)
        }
    })
}

// const authedUserRedirect = (req, res, next) => {
//     //if a user has a token, redirect them to the index page
//     if(req.cookies && req.cookies.access_token) {
//         verify(req.cookies.token)
//             .then((user) => {
//                 res.redirect(indexPage)
//             })
//             //if error, log error and do nothing
//             .catch((error) => {
//                 console.log(error)
//                 next()
//             })
//     } else {
//         //if no token, do nothing.
//         next()
//     }
// }

module.exports = {
    protectedPostRoute,
}