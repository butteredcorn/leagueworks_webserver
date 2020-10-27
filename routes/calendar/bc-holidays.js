const BC_HOLIDAYS = [
    {
      id: '20210101_60o30cho6co30c1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTAxMDFfNjBvMzBjaG82Y28zMGMxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: "New Year's Day",
      description: undefined,
      start: '2021-01-01',
      end: '2021-01-02'
    },
    {
      id: '20210215_60o30chpc8o38c1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTAyMTVfNjBvMzBjaHBjOG8zOGMxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'Family Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, New Brunswick, Ontario, Saskatchewan',
      start: '2021-02-15',
      end: '2021-02-16'
    },
    {
      id: '20210402_60o30cho6go30c1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTA0MDJfNjBvMzBjaG82Z28zMGMxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'Good Friday',
      description: undefined,
      start: '2021-04-02',
      end: '2021-04-03'
    },
    {
      id: '20210524_60o30cho70o30e1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTA1MjRfNjBvMzBjaG83MG8zMGUxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'Victoria Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nunavut, Ontario, Saskatchewan, Yukon',
      start: '2021-05-24',
      end: '2021-05-25'
    },
    {
      id: '20210701_60o30choc8o30c1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTA3MDFfNjBvMzBjaG9jOG8zMGMxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'Canada Day',
      description: undefined,
      start: '2021-07-01',
      end: '2021-07-02'
    },
    {
      id: '20210802_60o30cj16so30e1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTA4MDJfNjBvMzBjajE2c28zMGUxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'British Columbia Day (British Columbia)',
      description: 'Holiday or observance in: British Columbia',
      start: '2021-08-02',
      end: '2021-08-03'
    },
    {
      id: '20210906_60o30chocgo30e1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTA5MDZfNjBvMzBjaG9jZ28zMGUxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'Labour Day',
      description: undefined,
      start: '2021-09-06',
      end: '2021-09-07'
    },
    {
      id: '20211011_60o30chocko30e1g60o30dr56k',
      html_link: 'https://www.google.com/calendar/event?eid=MjAyMTEwMTFfNjBvMzBjaG9ja28zMGUxZzYwbzMwZHI1NmsgZW4uY2FuYWRpYW4jaG9saWRheUB2',
      summary: 'Thanksgiving Day (regional holiday)',
      description: 'Holiday or observance in: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nova Scotia, Nunavut, Ontario, Quebec, Saskatchewan, Yukon',
      start: '2021-10-11',
      end: '2021-10-12'
    },
    {
        id: '20201111_60o30chp60o30c1g60o30dr56g',
        html_link: 'https://www.google.com/calendar/event?eid=MjAyMDExMTFfNjBvMzBjaHA2MG8zMGMxZzYwbzMwZHI1NmcgZW4uY2FuYWRpYW4jaG9saWRheUB2',
        summary: 'Remembrance Day (regional holiday)',
        description: 'Holiday or observance in: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nova Scotia, Nunavut, Ontario, Prince Edward Island, Saskatchewan, Yukon',
        start: '2020-11-11',
        end: '2020-11-12'
    },
    {
    id: '20201225_60o30chp64o30c1g60o30dr56g',
    html_link: 'https://www.google.com/calendar/event?eid=MjAyMDEyMjVfNjBvMzBjaHA2NG8zMGMxZzYwbzMwZHI1NmcgZW4uY2FuYWRpYW4jaG9saWRheUB2',
    summary: 'Christmas Day',
    description: undefined,
    start: '2020-12-25',
    end: '2020-12-26'
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