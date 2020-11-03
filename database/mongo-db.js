const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

//(node:41087) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

// may need to move data connection to the endpoint for stability

let db;

function mongoStart() {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            db = await client.db(process.env.DB_NAME);
            resolve('db ready')
        } catch(error) {
            if (error) {
                reject(error)
            }
        }
    })
}    

const mongoClose = async() => {
    try {
        await client.close()
        console.log('mongo connection pool closed.')
    } catch (error) {
        console.log(error)
    }
}

const resetDatabase =  () => {
    return new Promise(async (resolve, reject) => {
        try {           
            if (!db) await mongoStart()

            await db.collection('users').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
                // result.message.users = res
            })
            await db.collection('leagues').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
                // result.message.leagues = res
            })

            await db.createCollection('leagues', (error, res) => {
                if (error) reject(error)
                console.log(res.namespace)
            })
            await db.createCollection('users', (error, res) => {
                if (error) reject(error)
                console.log(res.namespace)
            })
            
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

const getUserByEmail = ({email}) => {
    return new Promise (async (resolve, reject) => {
        try {  
            //console.log(db)
            if (!db) await mongoStart()

            await db.collection('users').findOne({email: email}, (err, res) => {
                if(err) {
                    reject(err)
                }
                resolve(res)
            })
    
        } catch(error) {
            reject(error)
        }
    })
}

const createUser = ({first_name, last_name, birth_date, phone_number, email, password_hash, leagues, messages}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            await db.collection('users').insertOne({first_name, last_name, birth_date, phone_number, email, password_hash, leagues, messages}, (err, res) => {
                if (err) reject(err)
                resolve(res.ops)
            })
        } catch(error) {
            if (error) {
                reject(error)
            }
        }
    })
}

const getLeague = ({league_id, email}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (league_id) {
                await db.collection('leagues').findOne({league_id: league_id}, (err, doc) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(doc)
                })
            } else if (email) {
                await db.collection('leagues').findOne({email: email}, (err, doc) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(doc)
                })
            } else {
                throw new Error("Please specify either valid ID or email.")
            }
    
        } catch(error) {
            reject(error)
        }
    })
}

const createLeague = ({league_name, phone_number, email, sport_type}) => {
    return new Promise(async (resolve, reject) => {
        try {            
            if (!db) await mongoStart()
            await db.collection('leagues').insertOne({league_name, phone_number, email, sport_type}, (err, res) => {
                if(err) reject(err)
                resolve(res.ops)
            })
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
    getLeague,
    createLeague,
}
