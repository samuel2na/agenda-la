require('dotenv').config();

const { Client } = require('@notionhq/client');

/*{
  Confirmado: { id: 'IF%5CU', type: 'checkbox', checkbox: true },
  Paciente: { id: 'JDih', type: 'rich_text', rich_text: [ [Object] ] },
  Date: {
    id: '%7BBH%7D',
    type: 'date',
    date: { start: '2021-11-05T09:00:00.000-03:00', end: null }
  },
  Name: { id: 'title', type: 'title', title: [ [Object] ] }
}*/
const read = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.databases.query({
    database_id: process.env.TAB_AGENDAMENTOS,
    page_size: 100,
  });

  data.results.forEach((result) => {
    const properties = result.properties;
    console.log(properties);
  });
};

read();
