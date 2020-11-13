const db = require('../../database/mongo-db')
const hash = require('./bcrypt').hashFunction
const compare = require('./bcrypt').compareHashAndPassword
const {MINIMUM_AGE_REQUIREMENT} = require('../../globals').platform_restrictions


/**
 * create user and put into database
 * return newly created user
 * 
 */
const signUpUser = ({first_name, last_name, birth_date, phone_number, email, password}) => {
    
    //calculate age from birthday here
    const age = 18;

    return new Promise((resolve, reject) => {
        try {
            //check to see if email (which is a unique alternate key) already taken
            if (age < MINIMUM_AGE_REQUIREMENT) {
                reject(new Error(`ERROR: Minimum age is ${MINIMUM_AGE_REQUIREMENT}. Sorry!`))
            } else {
                emailAlreadyExist(email)
                .then(() => {
                    return hash(password)
                })
                // hash(password)
                .then(async (hashedPassword) => {
                    try {
                        const newUser = {first_name: first_name, last_name: last_name, birth_date: birth_date, phone_number: phone_number, email: email, password_hash: hashedPassword, leagues: [], messages: []}
                        await db.createUser(newUser) //for some reason, can't modify the return result, delete won't work, can't call the properties???
                        const user = await db.getUser({email: email})
                        delete user.password_hash
                        resolve(user)
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

// {
//     _id: 5f77e41c9de71f5b23d6fa42,
//     first_name: 'justin',
//     last_name: 'admin',
//     birth_date: 'DOB',
//     phone_number: '604-888-8888',
//     email: 'test@test.com',
//     password_hash: 'some_password_hash',
//     leagues: [],
//     messages: []
//   }

/**
 * 
 * check to make sure user exists and passwords match
 * then return user
 */
const loginUser = ({email, password}) => {
    return new Promise(async (resolve, reject) => {
        const crypticUsernamePasswordError = "Incorrect email and password combination. Who knows what the issue is. Â¯\_(ãƒ„)_/Â¯"
        try {
            //find the user by email
            const user = await db.getUser({email})
            if (user) {
                //user confirmed, then try password
                compare(password, user.password_hash)
                    .then((result) => {
                        //check for admin here
                        delete user.password_hash
                        //resolve the user object
                        resolve(user)
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(crypticUsernamePasswordError)
                    })
                resolve(user)
            } else {
                reject(crypticUsernamePasswordError)
            }
        } catch(error) {
            //error with db.getUsers
            reject(error)
        }
    })
}


//fix
const emailAlreadyExist = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const emailMatch = await db.getUser({email: email})

            console.log(emailMatch)

            if (emailMatch != null) {
                reject (new Error('Email already taken.'))
            } else {
                resolve('Email good to use.')
            }
        } catch(err) {
            reject(err)
        }
    })
}

module.exports = {
    signUpUser,
    loginUser
}