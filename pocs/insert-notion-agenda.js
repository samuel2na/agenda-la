require('dotenv').config();

const { Client } = require('@notionhq/client');

const registro = {
  Confirmado: { id: 'IF%5CU', type: 'checkbox', checkbox: false },
  Paciente: {
    id: 'JDih',
    type: 'rich_text',
    rich_text: [{ text: { content: 'Samuel 3' } }],
  },
  Date: {
    id: '%7BBH%7D',
    type: 'date',
    date: { start: '2021-12-17T10:00:00.000-03:00', end: null },
  },
  Name: {
    id: 'title',
    type: 'title',
    title: [{ text: { content: 'Samuel 3' } }],
  },
};

const insert = async () => {
  //console.log(process.env.NOTION_SECRET);
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const inserted = await notion.pages.create({
    parent: {
      database_id: process.env.TAB_AGENDAMENTOS,
    },
    properties: registro,
  });
  console.log(inserted);
};

insert();
