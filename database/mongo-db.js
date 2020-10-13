const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

//(node:41087) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

// may need to move data connection to the endpoint for stability
const mongoStart = async () => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);

        console.log('db ready')
        //console.log(db)
    } catch(error) {
        if (error) {
            console.log(error)
        }
    }
}

const mongoClose = async() => {
    try {
        await client.close()
        console.log('mongo connection pool closed.')
    } catch (error) {
        console.log(error)
    }
}

const resetDatabase = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await client.db(process.env.DB_NAME);
            
            const result = {}

            await db.collection('users').drop((error, response) => {
                if (error) reject(error)
                result.message = {msg1: response}
            })
            await db.createCollection('users', (error, response) => {
                if (error) reject(error)
                result.message.msg2 = response
            })
    
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

const getUserByEmail = async ({email}) => {
    return new Promise (async (resolve, reject) => {
        try {
            const db = await client.db(process.env.DB_NAME);
    
            await db.collection('users').findOne({email: email}, (err, doc) => {
                if(err) {
                    reject(err)
                }
                resolve(doc)
            })
    
        } catch(error) {
            reject(error)
        }
    })
}

const createUser = async ({first_name, last_name, birth_date, phone_number, email, password_hash, leagues, messages}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await client.db(process.env.DB_NAME);
            const result = await db.collection('users').insertOne({first_name, last_name, birth_date, phone_number, email, password_hash, leagues, messages}, (error) => {
                reject(error)
            })
            resolve(result)
        } catch(error) {
            if (error) {
                reject(error)
            }
        }
    })
}

module.exports = {
    mongoStart,
    mongoClose,
    resetDatabase,
    getUserByEmail,
    createUser,
}