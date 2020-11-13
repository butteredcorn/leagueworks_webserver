const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

//(node:41087) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

// may need to move data connection to the endpoint for stability

let db;

const formatUpdates = (updates) => {
    const formattedUpdates = Object.keys(updates).reduce((accumulator, key) => {
        if (typeof updates[key] === "undefined" || updates[key] == null ) return accumulator;
        accumulator[key] = updates[key];
        return accumulator;
      }, {});
    return formattedUpdates;
}

  

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

const loadArenas = (arenas) => {
    return new Promise(async(resolve, reject) => {
        try {
            arenas.forEach(async(arena, index) => {
                await db.collection('arenas').insertOne({arena_id: arena.google_place_id, name: arena.name, address: arena.address, phone_number: arena.phone_number, location: arena.location, photos: arena.photos, google_rating: arena.rating}, (err, res) => {
                    if (err) reject(err)
                })
            })
            resolve('arenas loaded.')
        } catch (err) {
            reject(err)
        }
    })
}

const resetDatabase =  () => {
    return new Promise(async (resolve, reject) => {
        try {           
            if (!db) await mongoStart()

            //drop all tables
            await db.collection('users').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
            })
            await db.collection('leagues').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
            })
            await db.collection('teams').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
            })
            await db.collection('season_schedules').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
            })
            await db.collection('matches').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
            })
            await db.collection('arenas').drop((error, res) => {
                if (error) reject(error)
                console.log(res)
            })
            


            //re-initialize tables
            await db.createCollection('arenas', (error, res) => {
                if (error) reject(error)
                console.log(res.namespace)
            }).then(() => {
                //load arenas from local storage (development only)
                const arenas = require('./assets/arenas')
                loadArenas(arenas)
            })
            await db.createCollection('matches', (error, res) => {
                if (error) reject(error)
                console.log(res.namespace)
            })
            await db.createCollection('season_schedules', (error, res) => {
                if (error) reject(error)
                console.log(res.namespace)
            })
            await db.createCollection('teams', (error, res) => {
                if (error) reject(error)
                console.log(res.namespace)
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


const getUser = ({user_id, email}) => {
    return new Promise (async (resolve, reject) => {
        try {  
            //console.log(db)
            if (!db) await mongoStart()

            if (email) {
                await db.collection('users').findOne({email: email}, (err, res) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(res)
                })
                //could introduce fault tolerance here by using another if statement for if id exists but no retrieval, then try again with email*
            } else if (user_id) {
                await db.collection('users').findOne({_id: ObjectID(user_id)}, (err, res) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(res)
                })
            } else {
                throw new Error(`Required user_id or email. It was ${{user_id, email}}`)
            }
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

//create update function for user to join a league
//create update function for appending a message to a user?

const getLeague = ({league_id, email}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (league_id) {
                await db.collection('leagues').findOne({_id: ObjectID(league_id)}, (err, doc) => {
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

const getTeam = ({team_id, email}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (team_id) {
                await db.collection('teams').findOne({_id: ObjectID(team_id)}, (err, doc) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(doc)
                })
            } else if (email) {
                await db.collection('teams').findOne({email: email}, (err, doc) => {
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

//initialize players to empty array?
const createTeam = ({league_id, team_name, phone_number, email, captain_id, players}) => {
    return new Promise(async (resolve, reject) => {
        try {            
            if (!db) await mongoStart()
            await db.collection('teams').insertOne({league_id, team_name, phone_number, email, captain_id, players}, (err, res) => {
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

const getArena = ({arena_id, email}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (arena_id) {
                await db.collection('arenas').findOne({_id: ObjectID(arena_id)}, (err, doc) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(doc)
                })
            } else if (email) {
                await db.collection('arenas').findOne({email: email}, (err, doc) => {
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

const createArena = ({email, phone_number, latitude, longitude, thumbnail_link, description}) => {
    return new Promise(async (resolve, reject) => {
        try {            
            if (!db) await mongoStart()
            await db.collection('arenas').insertOne({email, phone_number, latitude, longitude, thumbnail_link, description}, (err, res) => {
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

const getMatch = ({match_id}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (match_id) {
                await db.collection('matches').findOne({_id: ObjectID(match_id)}, (err, doc) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(doc)
                })
            } else {
                throw new Error(`Please specify valid match_id. It was ${match_id}.`)
            }
    
        } catch(error) {
            reject(error)
        }
    })
}

const createMatch = ({season_id, home_id, away_id, start_time, end_time, arena_id, winner_id, loser_id}) => {
    return new Promise(async (resolve, reject) => {
        try {            
            if (!db) await mongoStart()
            await db.collection('matches').insertOne({season_id, home_id, away_id, start_time, end_time, arena_id, winner_id, loser_id}, (err, res) => {
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

const updateMatch = ({match_id, updates}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (match_id && updates) {
                await db.collection('matches').findOneAndUpdate({_id: ObjectID(match_id)}, {$set: formatUpdates(updates)}, {returnOriginal: false}, (err, result) => {
                    if(err) reject(err)
                    resolve(result.value)
                })
            } else {
                throw new Error(`Please specify valid match_id. It was ${match_id}. Ensure updates are passed through as nested object, updates was ${updates}.`)
            }
    
        } catch(error) {
            reject(error)
        }
    })
}
const getSeasonSchedule = ({season_schedule_id}) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!db) await mongoStart()

            if (season_schedule_id) {
                await db.collection('season_schedules').findOne({_id: ObjectID(season_schedule_id)}, (err, doc) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(doc)
                })
            } else {
                throw new Error(`Please specify valid season_schedule_id. It was ${season_schedule_id}.`)
            }
    
        } catch(error) {
            reject(error)
        }
    })
}

const createSeasonSchedule = ({league_id, matches, season_start, season_end, season_arenas}) => {
    return new Promise(async (resolve, reject) => {
        try {            
            if (!db) await mongoStart()
            await db.collection('season_schedules').insertOne({league_id, matches, season_start, season_end, season_arenas}, (err, res) => {
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
    getUser,
    createUser,
    getLeague,
    createLeague,
    getTeam,
    createTeam,
    getArena,
    createArena,
    getMatch,
    createMatch,
    updateMatch,
    getSeasonSchedule,
    createSeasonSchedule,
}
