const db = require('../../database/mongo-db')
const hash = require('./bcrypt').hashFunction
const compare = require('./bcrypt').compareHashAndPassword
const {MINIMUM_AGE_REQUIREMENT} = require('../../globals').platform_restrictions


/**
 * create user and put into database
 * and then log them in
 * 
 */
const signUpUser = ({first_name, last_name, birth_date, phone_number, email, password}) => {
    
    const age = 18;

    return new Promise((resolve, reject) => {
        try {
            //check to see if email (which is a unique alternate key) already taken
            if (age < MINIMUM_AGE_REQUIREMENT) {
                reject(new Error(`ERROR: Minimum age is ${MINIMUM_AGE_REQUIREMENT}. Sorry!`))
            } else {
                // emailAlreadyExist(email)
                // .then(() => {
                //     return hash(password)
                // })
                hash(password)
                .then(async (hashedPassword) => {
                    try {
                        const newUser = {first_name: first_name, last_name: last_name, birth_date: birth_date, phone_number: phone_number, email: email, password_hash: hashedPassword, leagues: [], messages: []}
                        await db.createUser({first_name: first_name, last_name: last_name, birth_date: birth_date, phone_number: phone_number, email: email, password_hash: hashedPassword, leagues: [], messages: []}) //implement
                        delete newUser.password_hash

                        resolve(newUser)
                    } catch (error) {
                        //problem creating user
                        reject(error)
                    }
                })
                .catch((error) => {
                    reject(error)
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const loginUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        const crypticUsernamePasswordError = "Incorrect email and password combination. Who knows what the issue is. Â¯\_(ãƒ„)_/Â¯"
        try {
            //find the user by email
            //await db.createConnection()
            const user = await db.getUsers('id, email, password_hash, first_name, last_name, city_of_residence', `WHERE email = '${email}'`)
            console.log(user)
            if (user && Array.isArray(user) && user.length > 0) {
                //user confirmed, then try password
                compare(password, user[0].password_hash)
                    .then((result) => {
                        if(result && user[0] && user[0].id <= admins.length && admins.includes(user[0].first_name)) {
                            user[0].admin = true
                        }
                        delete user[0].password_hash
                        //resolve the user object
                        resolve(user[0])
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(crypticUsernamePasswordError)
                    })
            } else {
                reject(crypticUsernamePasswordError)
            }
        } catch(error) {
            //error with db.getUsers
            reject(error)
        } finally {
            //await db.closeConnection()
        }
    })
}


//fix
const emailAlreadyExist = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const emailMatch = await db.getUserByEmail({email: email})

            if (emailMatch != null) {
                reject (new Error('Email already taken.'))
            } else {
                resolve('Email good to use.')
            }
        } catch(error) {
            reject(error)
        }
    })
}

module.exports = {
    signUpUser,
    loginUser
}