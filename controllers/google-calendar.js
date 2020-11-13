
const { google } = require('googleapis')

const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_SECRET)
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN}) //if fail, revert to TEST_TOKEN
const calendar = google.calendar({version: 'v3', auth: oAuth2Client})

const axios = require('axios')
const Batchelor = require('batchelor')
const BC_HOLIDAYS = require('./bc-holidays')


const calendarID = 'primary'
const canadianHolidays = 'en.canadian#holiday@group.v.calendar.google.com'
const timeZone = 'America/Vancouver'

//User passes in their timeslots through the front end
//Google calendar can handle holidays and days?
//Canadian Holidays at calendarID = en.canadian#holiday@group.v.calendar.google.com

const getBCHolidays = async () => {
    return new Promise((resolve, reject) => {
        try {
            const maxResults = 50; //56 is the number of events for 2021, but includes one 'observed' event, need to finetune this, or somehow figure out end number dynamically
    
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
                        if (event.summary && event.summary.includes("British Columbia") && !event.summary.includes("Healthcare Aide Day") || event.description && event.description.includes("British Columbia") && !event.summary.includes("Healthcare Aide Day")) {
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
            const newLeagueCalendar = await calendar.calendars.insert({requestBody: {
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

            //newLeagueCalendar contains the response object with the calendar ID

            //get the calendar ID

            //on creation, insert holidays, then as an option on creating schedule enable/disable holidays


        } catch (err) {
            reject(err)
        }
    })
}

//check to ensure the timeslot is free, so we do not doublebook
//the primary calendar is the main calendar for a google account
const createNewEvent = async (calendarID, newEvent) => {
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
        
            //access events in events array to discriminate against certain events***

            //OR

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

/**
 * 
 * @param {*} calendarID - google calendar I1   
 * @param { array } events  - array of event objects
 */
const batchEvents = (calendarID, events, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {

            //console.log(accessToken)

            const batch = new Batchelor({
                // Any batch uri endpoint in the form: https://www.googleapis.com/batch/<api>/<version>
                'uri':'https://www.googleapis.com/batch/calendar/v3',
                'method':'POST',
                'auth': {
                    'bearer': accessToken  //MUST BE OAUTH ACCESS TOKEN, NOT REFRESH TOKEN
                },
                'headers': {
                    // 'Authorization': `Bearer ${oAuth2Client.credentials.refresh_token}`,
                    'Content-Type': 'multipart/mixed' //default settings: multipart/mixed
                }
            });

            //foreach add every holiday
            events.forEach((event, index) => {
                batch.add({
                    'method':'POST',
                    'path':`/calendar/v3/calendars/${calendarID}/events`,
                    'parameters':{
                        'Content-Type':'application/json;',
                        'body': event
                    }
                    ,
                    'callback': function(response){
                        resolve(response);
                        if(response.body.error) {
                            reject(response.body.error)
                        }
                    }
                })
            })
            
            batch.run((err, res) => {
                if(err) {
                    reject(err)
                } else {
                    console.log(res)
                    resolve(res)
                }
            })


            
        } catch (err) {
            reject(err)
        }
    })
}

// https://www.googleapis.com/batch/calendar/v3
// Authorization: Bearer your_auth_token
// Content-Type: multipart/mixed; boundary=batch_google_calendar

// --batch_google_calendar
// Content-Type: application/http
// Content-ID: <item-0-batchevent@example.com>

// POST /calendar/v3/calendars/your_calendar_id@group.calendar.google.com/events
// Content-Type: application/json

// {"summary":"batch API test","start":{"date":"2020-07-31"},"end":{"date":"2020-07-31"}}
// --batch_google_calendar--

// {
//     statusCode: '200',
//     statusMessage: 'OK',
//     headers: {
//       ETag: '"3208226066228000"',
//       'Content-Type': 'application/json; charset=UTF-8',
//       Vary: 'Referer',
//       'Content-ID': 'Batchelor_cf66580ce46de63ac11a48bbc9f78e27'
//     },
//     body: {
//       kind: 'calendar#event',
//       etag: '"3208226066228000"',
//       id: 'nn5csp891se3rrk5ht2ab8at9k',
//       status: 'confirmed',
//       htmlLink: 'https://www.google.com/calendar/event?eid=bm41Y3NwODkxc2UzcnJrNWh0MmFiOGF0OWsgc2YxY3NobzJrcTg4NmIzaDZlc3VwdGs3dThAZw',
//       created: '2020-10-31T02:57:13.000Z',
//       updated: '2020-10-31T02:57:13.114Z',
//       summary: 'Basketball Game',
//       description: 'Basketball Game between the Lakers and Nuggets.',
//       location: '6260 Killarney St, Vancouver, BC V5S 2X7',
//       colorId: '1',
//       creator: { email: 'justin.rokudo@gmail.com' },
//       organizer: {
//         email: 'sf1csho2kq886b3h6esuptk7u8@group.calendar.google.com',
//         displayName: 'League Calendar',
//         self: true
//       },
//       start: {
//         dateTime: '2020-10-07T19:57:12-07:00',
//         timeZone: 'America/Vancouver'
//       },
//       end: {
//         dateTime: '2020-10-07T20:57:12-07:00',
//         timeZone: 'America/Vancouver'
//       },
//       iCalUID: 'nn5csp891se3rrk5ht2ab8at9k@google.com',
//       sequence: 0,
//       reminders: { useDefault: true }
//     }
//   }
  

module.exports = {
    createNewEvent,
    batchEvents,
    getBCHolidays,
    createNewCalendar
}