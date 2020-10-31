const BC_HOLIDAYS = [
    {
      summary: 'Remembrance Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nova Scotia, Nunavut, Ontario, Prince Edward Island, Saskatchewan, Yukon',
      start: { date: '2020-11-11', timeZone: 'America/Vancouver' },
      end: { date: '2020-11-12', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Christmas Day',
      description: undefined,
      start: { date: '2020-12-25', timeZone: 'America/Vancouver' },
      end: { date: '2020-12-26', timeZone: 'America/Vancouver' }
    },
    {
      summary: "New Year's Day",
      description: undefined,
      start: { date: '2021-01-01', timeZone: 'America/Vancouver' },
      end: { date: '2021-01-02', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Family Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, New Brunswick, Ontario, Saskatchewan',
      start: { date: '2021-02-15', timeZone: 'America/Vancouver' },
      end: { date: '2021-02-16', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Good Friday',
      description: undefined,
      start: { date: '2021-04-02', timeZone: 'America/Vancouver' },
      end: { date: '2021-04-03', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Victoria Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nunavut, Ontario, Saskatchewan, Yukon',
      start: { date: '2021-05-24', timeZone: 'America/Vancouver' },
      end: { date: '2021-05-25', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Canada Day',
      description: undefined,
      start: { date: '2021-07-01', timeZone: 'America/Vancouver' },
      end: { date: '2021-07-02', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'British Columbia Day (British Columbia)',
      description: 'Holiday or observance in: British Columbia',
      start: { date: '2021-08-02', timeZone: 'America/Vancouver' },
      end: { date: '2021-08-03', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Labour Day',
      description: undefined,
      start: { date: '2021-09-06', timeZone: 'America/Vancouver' },
      end: { date: '2021-09-07', timeZone: 'America/Vancouver' }
    },
    {
      summary: 'Thanksgiving Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nova Scotia, Nunavut, Ontario, Quebec, Saskatchewan, Yukon',
      start: { date: '2021-10-11', timeZone: 'America/Vancouver' },
      end: { date: '2021-10-12', timeZone: 'America/Vancouver' }
    }
  ]

module.exports = BC_HOLIDAYS

//event object:
// {
                //     kind: 'calendar#event',
                //     etag: '"3116267108000000"',
                //     id: '20210802_60o30cj16so30e1g60o30dr56k',
                //     status: 'confirmed',
                //     htmlLink: 'https://www.google.com/calendar/event?eid=MjAyMTA4MDJfNjBvMzBjajE2c28zMGUxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
                //     created: '2019-05-17T22:52:34.000Z',
                //     updated: '2019-05-17T22:52:34.000Z',
                //     summary: 'British Columbia Day (British Columbia)',
                //     description: 'Holiday or observance in: British Columbia',
                //     creator: {
                //       email: 'en.canadian#holiday@group.v.calendar.google.com',
                //       displayName: 'Holidays in Canada',
                //       self: true
                //     },
                //     organizer: {
                //       email: 'en.canadian#holiday@group.v.calendar.google.com',
                //       displayName: 'Holidays in Canada',
                //       self: true
                //     },
                //     start: { date: '2021-08-02' },
                //     end: { date: '2021-08-03' },
                //     transparency: 'transparent',
                //     visibility: 'public',
                //     iCalUID: '20210802_60o30cj16so30e1g60o30dr56k@google.com',
                //     sequence: 0
                //   },