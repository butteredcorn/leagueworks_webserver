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

function getYYYYMMDD(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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

    //console.log(holiday_dates)
    //check to see if gameDate is a holiday
    if(skipHolidays) {
        let holidayConflict = false
        
        do {
            if (holiday_dates.includes(getYYYYMMDD(nextGameDate))) {
                holidayConflict = true
                console.log('holiday conflict detected')
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
            } else {
                holidayConflict = false;
            }
        } while(holidayConflict)
    }

    return({nextGameDate, nextGameDay})
}

//handles holidays
//it will return the next game dates
const getGameDates = ({firstGameDate, firstGameDay, gameDayNums, skipHolidays, matchSets, matchesPerSet, matchSetsPerWeek}) => {
    //number of game dates per week = days per week played (compare to matches, enough to fill)
    const numGameDatesPerWeek = gameDayNums.length < matchesPerSet ? gameDayNums.length : matchesPerSet
    //number of games dates = games dates per week * the number of match sets / the number of match sets played in a week
    const numGameDates = numGameDatesPerWeek * Object.keys(matchSets).length / matchSetsPerWeek

    console.log(`Games per week (average): ${numGameDatesPerWeek}`)
    console.log(`Total number of games dates: ${numGameDates}`)


    const gameDates = []
    let gameDate = firstGameDate
    let gameDay = firstGameDay

    for (let i = 0; i < numGameDates; i++) {
        const {nextGameDate, nextGameDay} = getNextGameDay(gameDate, gameDay, gameDayNums, skipHolidays)
        gameDates.push(nextGameDate)
        console.log(`Next game date: ${getYYYYMMDD(nextGameDate)}, which is a ${WEEK_DAYS[nextGameDay]}.`)
        gameDate = nextGameDate
        gameDay = nextGameDay
    }

    return {gameDates, numGameDatesPerWeek}
}

const generateSeasonSchedule = (season) => {
    return new Promise( async(resolve, reject) => {
        try {
            console.log(season)

            const teams = await db.getTeamsByLeague({league_id: season.league_id})
            console.log(teams)
            //const players = teams[0].players
            //console.log(players)

            const {matchSets, matchesPerSet} = getFormattedMatches(season.match_number, teams)
            if(!Number.isInteger(matchesPerSet)) throw new Error(`Integer is expected: uniform matchesPerSet is expected. It was ${matchesPerSet}.`)

            //console.log(util.inspect(matchSets, false, null, true))

            //startDate //to year-month-day
            //console.log(`season start date: ${startDate}`)

            //gameDays
            const gameDays = getGameDays(season.match_days)
            //console.log(gameDays)

            //matches per set
            //console.log(matchesPerSet)
            
            //figure out the weekly schedule
            //match_sets_per_week, match_set_(n)th
            //assign matches to gameDays*** ----> need one more instruction from front end to determine how to handle this

            //options is essentially hash function
            const defaultOptions = {
                hash: "uniform", //if there are 2 gameDays and 2 matchesPerSet, then each gameDay gets one match from the set
                remainder: "linear" //if there are 2 gameDays and 3 matchesPerSet, then the third game of every set will be assigned to a set gameDay
            }

            const result = assignMatchesToDays({startDate: season.season_start, gameDays, matchSets, matchesPerSet, matchSetsPerWeek: season.match_sets_per_week, skipHolidays: season.skip_holidays, options: defaultOptions})

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
    
    const gameDayNums = gameDays.map((day) => {
        return WEEK_DAYS.indexOf(day);
    })

    seasonSchedule.game_days_nums = gameDayNums
    seasonSchedule.match_sets = matchSets

    const startDay = new Date(startDate).getDay() //sunday is 0
    
    const {gameDates, numGameDatesPerWeek} = getGameDates({firstGameDate: startDate, firstGameDay: startDay, gameDayNums, skipHolidays, matchSets, matchesPerSet, matchSetsPerWeek})
    seasonSchedule.game_dates = gameDates
    seasonSchedule.end_date = gameDates[gameDates.length - 1]
    //handle options here
    //now time to assign games to gameDates through the hashfunction and its options
    //reference: gameDates, matchSets, matchesPerSet, matchSetsPerWeek
    const events = matchSetsToDays({gameDates, matchSets, matchesPerSet, matchSetsPerWeek, numGameDatesPerWeek, options})

    // console.log(events)
    // console.log('Game days:' + gameDates.length)
    // console.log('Games to be played:' + Object.keys(matchSets).length * matchesPerSet)
    // console.log(events.length)

    seasonSchedule.events = events

    return seasonSchedule
}


//need to implement options
const matchSetsToDays = ({gameDates, matchSets, matchesPerSet, matchSetsPerWeek, numGameDatesPerWeek, options}) => {
    if (options.hash != "uniform") throw new Error("Other options to be implemented in future release.")
    const numGamesPerDateAverage = matchesPerSet * matchSetsPerWeek / numGameDatesPerWeek
    const quotient = Math.floor(matchesPerSet * matchSetsPerWeek / numGameDatesPerWeek); // ie. 1
    const remainder = matchesPerSet * matchSetsPerWeek % numGameDatesPerWeek; // ie. r1

    const events = []
    let i = 0; 

    //for each matchSet
    for (let match_set in matchSets) {
        let remainderMatchesPerSet = remainder

        for (let match of matchSets[match_set]) {
        //for (let j = 0; j < match_set.length; j++) {
            // const homeTeam = match_set[j][0].home_team ? match_set[j][0] : match_set[j][1]
            // const awayTeam = !match_set[j][0].home_team ? match_set[j][0] : match_set[j][1]
            const homeTeam = match[0].home_team ? match[0] : match[1]
            const awayTeam = !match[0].home_team ? match[0] : match[1]

            if (remainderMatchesPerSet != 0) {
                while(remainderMatchesPerSet > 0) {
                    const remainderEvent = {
                        summary: `${homeTeam.team_name} vs. ${awayTeam.team_name}`,
                        home_team: homeTeam.team_id,
                        home_team_players: homeTeam.players,
                        away_team: awayTeam.team_id,
                        away_team_players: awayTeam.players,
                        start_date: getYYYYMMDD(gameDates[Math.floor(i/quotient)]) //first game date
                    }
                    events.push(remainderEvent)
                    remainderMatchesPerSet--;
                }
            } else {
                //where quotient is game per date minimum
                const event = {
                    summary: `${homeTeam.team_name} vs. ${awayTeam.team_name}`,
                    home_team: homeTeam.team_id,
                    home_team_players: homeTeam.players,
                    away_team: awayTeam.team_id,
                    away_team_players: awayTeam.players,
                    start_date: getYYYYMMDD(gameDates[Math.floor(i/quotient)]) //first game date
                }
                events.push(event)
                i++; //where one to one, just assign one event to one date
            }
        }
    }

    return events
}



module.exports = {
    generateSeasonSchedule,
    getYYYYMMDD
}