import { getBlockedDays, getCountEventsByDay } from '../../lib/notion';
import { getPossibleDays } from '../../lib/date-handler';

export default async function (req, res) {
  //api/days?start=2021-12-13&end=2021-12-17
  const { start, end } = req.query;

  const days = await getBlockedDays();
  const possibleDays = getPossibleDays(days);

  const countings = await getCountEventsByDay(start, end);

  const possibleDaysRange = possibleDays
    .filter((day) => {
      return day.date >= start && day.date <= end;
    })
    .map((day) => {
      let available = false;
      if (!countings[day.date]) {
        available = true;
      } else {
        available = countings[day.date] < 8;
      }
      return {
        ...day,
        available,
      };
    });

  res.send({
    possibleDaysRange,
  });
}
