const express = require('express')
const router = express.Router()
const {createNewEvent, createNewCalendar, getBCHolidays, batchEvents} = require('../../controllers/google-calendar')

router.get('/test', async(req, res) => {
    try {
        
        //the event object
        //import data from front end ie. form to declare eventStartTime and eventEndTime
        const eventStartTime = new Date()
        const eventEndTime = new Date()
        const timeZone = 'America/Vancouver'
        const defaultColorID = 1


        //`eventStartTime.getDay() + 2` sets the day for tomorrow
        eventStartTime.setDate(eventStartTime.getDay() + 2)

        //we will make the end time end 1 hour later
        eventEndTime.setDate(eventEndTime.getDay() + 2)
        eventEndTime.setMinutes(eventEndTime.getMinutes() + 60)

        const theEvent = {
            summary: "Basketball Game",
            location: "6260 Killarney St, Vancouver, BC V5S 2X7",
            description: "Basketball Game between the Lakers and Nuggets.",
            colorId: defaultColorID, //there are 11 different colorIDs
            start: {
                dateTime: eventStartTime, //equal to date and time
                timeZone: timeZone//standard javascript timezone
            },
            end: {
                dateTime: eventEndTime,
                timeZone: timeZone
            }
        }
        createNewEvent('primary', theEvent)

        res.send("complete.")
    } catch (error) {
        console.log(error)
    }
})

router.get('/create-calendar', async (req, res) => {
    try {
        const result = await createNewCalendar()
        console.log(result)
        res.send(result)

    } catch (err) {
        res.send(err)
    }
})


router.get('/holidays', async (req, res) => {
    try {
        const holidays = await getBCHolidays()
        console.log(holidays)
        res.send({data: holidays})
    } catch (error) {
        res.send(error)
    }
})

router.get('/uploadHolidays', async (req, res) => {
    try {
        const events = require('../../controllers/bc-holidays')

        const result = await batchEvents("sf1csho2kq886b3h6esuptk7u8@group.calendar.google.com", events)
        console.log(result)
        res.send(result)
    } catch (err) {
        res.send(err)
    }
})




module.exports = router