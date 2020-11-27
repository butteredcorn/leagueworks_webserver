const db = require('../../database/mongo-db')
const {match, formattedMatch} = require('./round-robin')
const BC_HOLIDAYS = require('../bc-holidays')
const util = require('util')
const {matchTeams} = require('../scheduling/match-teams')

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const holiday_dates = BC_HOLIDAYS.map((holiday) => holiday.start.date)



const getFormattedMatches = (match_number, teams) => {
    const formattedMatchSets = {}
    let matchesPerSet = 0
    
    for(let i = 0; i < match_number; i++) {
        //this is one set of round robin matches
        const matchesArray = formattedMatch(teams.length, teams)
        // console.log(util.inspect(matchesArray, false, null, true))
        // console.log(matchesArray)

        for (let match_set of matchesArray) {                
            formattedMatchSets[`match_set_${matchesArray.indexOf(match_set) + 1 + i * matchesArray.length}`] = matchesArray[matchesArray.indexOf(match_set)]
            matchesPerSet = matchesPerSet + match_set.length
        }
    }
    matchesPerSet = matchesPerSet/Object.keys(formattedMatchSets).length
    return {matchSets: formattedMatchSets, matchesPerSet}
}

const getYYYYMMDD = (date) => {
    const dt = new Date(date)
    return (dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate())
}

const getGameDays = (match_days) => {
    const gameDays = []
    for (let day in match_days) {
        if(match_days[day]) {
            gameDays.push(day)
        }
    }

    return gameDays
}

//startDay is the 0-6 number representation of the season's start date
const getNextGameDay = (startDate, startDay, gameDayNums, skipHolidays) => {
    Date.prototype.addDays = function(days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    let nextGameDate = new Date(startDate);
    let nextGameDay

    for (let day of gameDayNums) {
        if(startDay < day) {
            nextGameDay = day;
        } else {
            nextGameDay = gameDayNums[0] //the first gameDay of the week
        }
    }

    nextGameDate.setDate(nextGameDate.getDate() + ((7-nextGameDate.getDay())%7+nextGameDay) % 7);

    //check to see if gameDate is a holiday
    if(skipHolidays) {
        while (holiday_dates.includes(getYYYYMMDD(nextGameDate))) {
            //do it again
            nextGameDate = nextGameDate.addDays(1)

            for (let day of gameDayNums) {
                if(nextGameDate.getDay() < day) {
                    nextGameDay = day;
                } else {
                    nextGameDay = gameDayNums[0] //the first gameDay of the week
                }
            }
            nextGameDate.setDate(nextGameDate.getDate() + ((7-nextGameDate.getDay())%7+nextGameDay) % 7);
        }
    }

    return({nextGameDate, nextGameDay})
}

const generateSeasonSchedule = (season) => {
    return new Promise( async(resolve, reject) => {
        try {
            let result

            console.log(season)

            const startDate = getYYYYMMDD(season.season_start)

            const teams = await db.getTeamsByLeague({league_id: season.league_id})
            console.log(teams)
            //const players = teams[0].players
            //console.log(players)

            const {matchSets, matchesPerSet} = getFormattedMatches(season.match_number, teams)
            if(!Number.isInteger(matchesPerSet)) throw new Error(`Integer is expected: uniform matchesPerSet is expected. It was ${matchesPerSet}.`)

            console.log(util.inspect(matchSets, false, null, true))

            //startDate //to year-month-day
            console.log(`season start date: ${startDate}`)

            //gameDays
            const gameDays = getGameDays(season.match_days)
            console.log(gameDays)

            //matches per set
            //console.log(matchesPerSet)
            
            //figure out the weekly schedule
            //match_sets_per_week, match_set_(n)th
            //assign matches to gameDays*** ----> need one more instruction from front end to determine how to handle this

            //options is essentially hash function
            const defaultOptions = {
                hash: "uniform", //if there are 2 gameDays and 2 matchesPerSet, then each gameDay gets one match from the set
                spillover: "linear" //if there are 2 gameDays and 3 matchesPerSet, then the third game of every set will be assigned to a set gameDay
            }

            assignMatchesToDays({startDate: season.season_start, gameDays, matchSets, matchesPerSet, matchSetsPerWeek: season.match_sets_per_week, skipHolidays: season.skip_holidays, options: defaultOptions})

            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
}

const assignMatchesToDays = ({startDate, gameDays, matchSets, matchesPerSet, matchSetsPerWeek, skipHolidays, options}) => {
    const seasonSchedule = {}
    seasonSchedule.start_date = startDate
    seasonSchedule.game_days = gameDays
    
    const startDay = new Date(startDate).getDay() //sunday is 0
    //ie. 3 for wednesday

    const gameDayNums = gameDays.map((day) => {
        return WEEK_DAYS.indexOf(day);
    })

    seasonSchedule.game_days_nums = gameDayNums

    //find the first gameDay after the startDate
    const {nextGameDate, nextGameDay} = getNextGameDay(startDate, startDay, gameDayNums, skipHolidays)
    console.log(`Next game date: ${getYYYYMMDD(nextGameDate)}, which is a ${WEEK_DAYS[nextGameDay]}.`)

    seasonSchedule.first_game_date = nextGameDate
    
    getGameDates({firstGameDate: nextGameDate, firstGameDay: nextGameDay, gameDayNums, skipHolidays, matchSets, matchesPerSet, matchSetsPerWeek})



    console.log(seasonSchedule)
}

//handles holidays
//it will return the next game day
//combine with hash function
//this should handle options here
const getGameDates = ({firstGameDate, firstGameDay, gameDayNums, skipHolidays, matchSets, matchesPerSet, matchSetsPerWeek}) => {
    const gameDates = []
    const {nextGameDate, nextGameDay} = getNextGameDay(firstGameDate, firstGameDay, gameDayNums, skipHolidays)
    console.log(`Next game date: ${getYYYYMMDD(nextGameDate)}, which is a ${WEEK_DAYS[nextGameDay]}.`)
}



module.exports = {
    generateSeasonSchedule
}