
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_SECRET)
oAuth2Client.setCredentials({refresh_token: process.env.TEST_TOKEN})
const calendar = google.calendar({version: 'v3', auth: oAuth2Client})


const calendarID = 'primary'

//check to ensure the timeslot is free, so we do not doublebook
//the primary calendar is the main calendar for a google account
const createNewEvent = async (newEvent) => {
    try {
        calendar.freebusy.query({
            resource: {
                timeMin: newEvent.start.dateTime,
                timeMax: newEvent.end.dateTime,
                timeZone: newEvent.start.timeZone,
                items: [{id: calendarID}] //array of calendars (objects) - a person may have many calendars ie. a work calendar, a personal calendar etc.
            }
        }, (err, res) => {
            if (err) {
                console.log(err)
            }
        
            //get the calendar events (array)
            const eventsArray = res.data.calendars.primary.busy
        
            //if there are no events in the calendar ie. array.length == 0, then insert a new event
            if(eventsArray.length == 0) {
                
                return calendar.events.insert({calendarId: calendarID, resource: newEvent}, (err) => {
                    if (err) {
                        return console.log(err)
                    }
                    return console.log("Calendar Event Created.")
                })
            }
            return console.log("sorry, busy.")
        })
    }catch (err) {
        console.log(err)
    }
}

module.exports = {
    createNewEvent
}