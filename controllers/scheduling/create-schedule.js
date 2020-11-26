const db = require('../../database/mongo-db')
const {match} = require('./round-robin')
const BC_HOLIDAYS = require('../bc-holidays')


const getLeagueTeams = (league_id) => {
    return new Promise((resolve, reject) => {
        try {
            const teams = await db.getTeamsByLeague({league_id})
            resolve(teams)
        } catch (err) {
            reject(err)
        }
    })
}

const generateSeasonSchedule = (season) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result

            console.log(season)

            const startDate = new Date(season.season_start).toLocaleDateString() //11/25/2020
            console.log(startDate)

            const teams = await db.getTeamsByLeague({league_id: season.league_id})
            console.log(teams)

            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    generateSeasonSchedule
}