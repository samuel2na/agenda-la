require('dotenv').config();

const { Client } = require('@notionhq/client');

const read = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.databases.query({
    database_id: process.env.TAB_NEGATIVA,
    page_size: 100,
  });

  //console.log(data.results.properties.Date);
  data.results.forEach((result) => {
    let blockedDate;
    if (result.properties.Date.date != undefined) {
      blockedDate = result.properties.Date.date.start;
      console.log(blockedDate);
    }
  });
};

read();
