import { Client } from '@notionhq/client';
import { zeroPad } from './date-handler';

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const getBlockedDays = async () => {
  const data = await notion.databases.query({
    database_id: process.env.BLOCKED_DB,
    page_size: 100,
    filter: {
      property: 'Date',
      date: {
        after: new Date(),
      },
    },
  });

  const blockedDays = data.results.map(
    (result) => result.properties.Date.date.start
  );

  return blockedDays;
};

export const getCountEventsByDay = async (start, end) => {
  const data = await notion.databases.query({
    database_id: process.env.SCHEDULE_DB,
    page_size: 100,
    filter: {
      and: [
        {
          property: 'Date',
          date: {
            on_or_after: start,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: end,
          },
        },
      ],
    },
  });

  const countings = data.results
    .map((result) => result.properties.Date.date.start)
    .map((date) => date.split('T')[0])
    .reduce((prev, curr) => {
      if (!prev[curr]) {
        prev[curr] = 0;
      }
      prev[curr]++;
      return prev;
    }, {});

  return countings;
};

export const getAvailableHours = async (date) => {
  const data = await notion.databases.query({
    database_id: process.env.SCHEDULE_DB,
    page_size: 100,
    filter: {
      and: [
        {
          property: 'Date',
          date: {
            on_or_after: date,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: date,
          },
        },
      ],
    },
  });

  const startHour1 = 8;
  const endHour1 = 12;
  const startHour2 = 14;
  const endHour2 = 18;
  const increment = 1;

  const hours = [];

  for (let i = startHour1; i < endHour1; i++) {
    hours.push({
      hour: zeroPad(i) + ':00:00',
      available: true,
    });
  }
  for (let i = startHour2; i < endHour2; i++) {
    hours.push({
      hour: zeroPad(i) + ':00:00',
      available: true,
    });
  }
  //console.log(hours);

  const blockedHours = data.results
    .map((result) => result.properties.Date.date.start)
    .map((date) => date.split('T')[1])
    .map((date) => date.split('.')[0])
    .sort();

  const availableHours = hours.map((hour) => {
    return {
      ...hour,
      available: blockedHours.indexOf(hour.hour) < 0,
    };
  });

  return availableHours;
};

const getNotionRecord = ({ date, name, phone }) => {
  return {
    Confirmado: { id: 'IF%5CU', type: 'checkbox', checkbox: false },
    Paciente: {
      id: 'JDih',
      type: 'rich_text',
      rich_text: [{ text: { content: name } }],
    },
    Date: {
      id: '%7BBH%7D',
      type: 'date',
      date: { start: date, end: null },
    },
    Name: {
      id: 'title',
      type: 'title',
      title: [{ text: { content: name } }],
    },
    Observacoes: {
      id: 'QfnU',
      type: 'rich_text',
      rich_text: [{ text: { content: name } }],
    },
    Telefone: {
      id: 'dY%3Ch',
      type: 'rich_text',
      rich_text: [{ text: { content: phone } }],
    },
  };
};

export const insertSchedule = async ({ date, name, phone }) => {
  const registro = getNotionRecord({ date, name, phone });

  const inserted = await notion.pages.create({
    parent: {
      database_id: process.env.SCHEDULE_DB,
    },
    properties: registro,
  });

  return inserted;
};
