const {match} = require('./round-robin')
const util = require('util')

const player1 = {
    first_name: 'justin',
    last_name: 'j',
    birth_date: 'date',
    phone_number: '',
    email: '',
    leagues: [
        {
            league_id: 0,
            team_id: 0
        }
    ],
    message: []
}

const teams = [
    //id 0
    {
        league_id: 0,
        captain_name: 'justin',
        contact_number: '604-888-8888',
        contact_email: 'captain@gmail.com',
        players: [
            player1
        ]
    },
    //id 1
    {
        league_id: 0,
        captain_name: 'alice',
        contact_number: '604-888-8888',
        contact_email: 'captain@gmail.com',
        players: [
            player1
        ]
    },

    {
        league_id: 0,
        captain_name: 'bob',
        contact_number: '604-888-8888',
        contact_email: 'captain@gmail.com',
        players: [
            player1
        ]
    },

    {
        league_id: 0,
        captain_name: 'karen',
        contact_number: '604-888-8888',
        contact_email: 'captain@gmail.com',
        players: [
            player1
        ]
    },
]

const matchTeams = () => {
    return new Promise((resolve, reject) => {
        try {
            const result = match(4, teams)
            console.log(util.inspect(result, false, null, true))
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    matchTeams
}