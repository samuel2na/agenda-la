require('dotenv').config();

const { Client } = require('@notionhq/client');

const read = async () => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  });

  const data = await notion.databases.query({
    database_id: process.env.TAB_NEGATIVA,
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
  console.log(blockedDays);

  const agora = new Date();

  const isWeekend = (dayOfWeek) => dayOfWeek === 0 || dayOfWeek === 6; // return true or false
  const zeroPad = (number) => (number < 10 ? '0' + number : number.toString());
  const toDateString = (date) =>
    `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(
      date.getDate()
    )}`;
  const isBlocked = (date) => blockedDays.indexOf(date) >= 0; // verify date is blocleked

  // dias diasPossiveis - desconsiderando sabados e domingos
  const diasPossiveis = [];
  for (let i = 0; i < 60; i++) {
    agora.setDate(agora.getDate() + 1);
    const dayOfWeek = agora.getDay();

    if (!isWeekend(dayOfWeek) && !isBlocked(toDateString(agora))) {
      diasPossiveis.push({
        date: toDateString(agora),
        dayOfWeek,
      });
    }
  }
  //console.log(diasPossiveis);

  // dado uma lista de dias separa em semanas
  let primeiroDia = null;
  const semanas = [];
  diasPossiveis.forEach((dia) => {
    if (primeiroDia == null) {
      primeiroDia = dia;
    }
    if (dia.dayOfWeek === 5) {
      semanas.push({
        start: primeiroDia,
        end: dia,
      });
      primeiroDia = null;
    }
  });

  console.log(semanas);
};

read();
