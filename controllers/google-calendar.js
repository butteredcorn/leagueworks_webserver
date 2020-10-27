
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_SECRET)
oAuth2Client.setCredentials({refresh_token: process.env.TEST_TOKEN})
const calendar = google.calendar({version: 'v3', auth: oAuth2Client})

const calendarID = 'primary'
const canadianHolidays = 'en.canadian#holiday@group.v.calendar.google.com'
const timeZone = 'America/Vancouver'

//User passes in their timeslots through the front end
//Google calendar can handle holidays and days?
//Canadian Holidays at calendarID = en.canadian#holiday@group.v.calendar.google.com

const getBCHolidays = async () => {
    return new Promise((resolve, reject) => {
        try {
            const maxResults = 56; //56 is the number of events for 2021, but includes one 'observed' event, need to finetune this, or somehow figure out end number dynamically
    
            calendar.events.list({
                calendarId: canadianHolidays,
                timeMin: (new Date()).toISOString(),
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
        
                if (err) return console.log('The API returned an error: ' + err);
        
                const events = res.data.items;
                //console.log(events)
    
                const formattedEvents = []
        
                if (events.length) {
                    const nationalHolidays = ["New Year's Day", "Good Friday", "Canada Day", "Labour Day", "Christmas Day"]
                    events.map((event, i) => {
                        if (event.summary && event.summary.includes("British Columbia") || event.description && event.description.includes("British Columbia")) {
                            formattedEvents.push({
                                //id: event.id,
                                //html_link: event.htmlLink,
                                summary: event.summary,
                                description: event.description,
                                start: { date: event.start.date, timeZone: timeZone },
                                end: { date: event.end.date, timeZone: timeZone }
                            })
                        } else if (event.summary && nationalHolidays.includes(event.summary)) {
                            formattedEvents.push({
                                //id: event.id,
                                //html_link: event.htmlLink,
                                summary: event.summary,
                                description: event.description,
                                start: { date: event.start.date, timeZone: timeZone },
                                end: { date: event.end.date, timeZone: timeZone }
                            })
                        }
                    });
        
                    resolve(formattedEvents)
                
                } else {
                reject(new Error('No holidays found!'))          
            }
            });
        } catch (err) {
            reject(err)
        }
    })
}

//pass an options object?
const createNewCalendar = () => {
    return new Promise( async(resolve, reject) => {
        try {
            const calendarName = "League Calendar"

            //promisified action, request object with nested requested body for params
            await calendar.calendars.insert({requestBody: {
                summary: calendarName,
                timeZone: timeZone
            }}).then((res) => {
                // {
                //     config: {},
                //       params: [Object: null prototype] {},
                //       validateStatus: [Function],
                //       body: '{"summary":"League Calendar","timeZone":"America/Vancouver"}',
                //       responseType: 'json'
                //     },
                //     data: {
                //       kind: 'calendar#calendar',
                //       etag: '"5t886cnLkol3gud2P8fOX_LJsPE"',
                //       id: 'sf1csho2kq886b3h6esuptk7u8@group.calendar.google.com',
                //       summary: 'League Calendar',
                //       timeZone: 'America/Vancouver',
                //       conferenceProperties: { allowedConferenceSolutionTypes: [Array] }
                //     },
                //     headers: {},
                //     status: 200,
                //     statusText: 'OK'
                //   }
                resolve(res)
            })

            //get the calendar ID

            //on creation, insert holidays, then as an option on creating schedule enable/disable holidays


        } catch (err) {
            reject(err)
        }
    })
}

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
    createNewEvent,
    getBCHolidays,
    createNewCalendar
}