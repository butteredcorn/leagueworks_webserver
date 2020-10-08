const jwt = require('jsonwebtoken')

createNewToken = (content) => {
    const key = process.env.JWT_SECRET
    return new Promise((resolve, reject) => {
        if(content) {
            if (typeof content == 'object') {
                jwt.sign(content, key, (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                })
            } else {
                reject(new Error("Content must be of type object."))
            }
        } else {
            reject(new Error("Content must exist."))
        }
    })
}

verifyExistingToken = (token) => {
    const key = process.env.JWT_SECRET
    return new Promise((resolve, reject) => {
        if(token) {
            jwt.verify(token, key, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        } else {
            reject(new Error(`No token found. Token passed in was ${token}.`))
        }
    })
}

module.exports = {
    createNewToken,
    verifyExistingToken
}