const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });



// may need to move data connection to the endpoint for stability
const mongoStart = async () => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);

        console.log(db.collection("users"))


    } catch(error) {
        if (error) {
            console.log(error)
        }
    } finally {
        await client.close();
    }
}

const resetDatabase = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
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
        } finally {
            await client.close();
        }
    })
}

const getUserByEmail = async ({email}) => {
    return new Promise (async (resolve, reject) => {
        try {
            await client.connect();
            const db = await client.db(process.env.DB_NAME);
    
            await db.collection('users').findOne({email: email}, (err, doc) => {
                if(err) {
                    reject(err)
                }
                console.log(doc)
                resolve(doc)
            })
    
        } catch(error) {
            reject(error)
        } finally {
            await client.close();
        }
    })
}

const createUser = async ({first_name, last_name, birth_date, phone_number, email, password_hash, leagues, messages}) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const db = await client.db(process.env.DB_NAME);
            const result = await db.collection('users').insertOne({first_name, last_name, birth_date, phone_number, email, password_hash, leagues, messages}, (error) => {
                reject(error)
            })
            resolve(result)
        } catch(error) {
            if (error) {
                reject(error)
            }
        } finally {
            await client.close();
        }
    })
}

module.exports = {
    mongoStart,
    resetDatabase,
    getUserByEmail,
    createUser,
}