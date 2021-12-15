require('dotenv').config();

const { Client } = require('@notionhq/client');

const read = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.databases.query({
    database_id: process.env.TAB_AGENDAMENTOS,
    page_size: 100,
    filter: {
      and: [
        {
          property: 'Date',
          date: {
            on_or_after: '2021-12-13',
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: '2021-12-18',
          },
        },
      ],
    },
  });

  const blockedDays = data.results
    .map((result) => result.properties.Date.date.start)
    .map((date) => date.split('T')[0])
    .reduce((prev, curr) => {
      if (!prev[curr]) {
        prev[curr] = 0;
      }
      prev[curr]++;
      return prev;
    }, {});
  //console.log(blockedDays);
  console.log(data.results[0].properties);
};

read();
