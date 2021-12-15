import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const fetcher = async (url) => {
  const data = await fetch(url);
  const json = await data.json();
  return json;
};

const friendlyDate = (date) =>
  date ? date.split('-').reverse().join('/') : '';

const daysOfWeekNames = [
  'Domindo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const Agende = () => {
  const router = useRouter();
  const { data } = useSWR(
    router.query.startDate
      ? '/api/days?start=' +
          router.query.startDate +
          '&end=' +
          router.query.endDate
      : null,
    fetcher
  );

  return (
    <>
      <Head>
        <title>Agenda - Selecione o dia</title>
      </Head>
      <h1 className='font-bold text-2xl'>Agende</h1>
      <p className='text-gray-500 mb-4'>
        Selecione um dia para agendar seu horário. ( Semana selecionada:{' '}
        {friendlyDate(router.query.startDate)} até{' '}
        {friendlyDate(router.query.endDate)} )
      </p>
      <p>
        <Link href={'/agende/'}>
          <a>Voltar</a>
        </Link>
      </p>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {!data && <p>Carregando...</p>}
      {data && (
        <div className='grid grid-cols-3 gap-2'>
          {data.possibleDaysRange.map((day) => {
            if (day.available) {
              return (
                <Link
                  key={day.date}
                  href={
                    '/agende/' +
                    router.query.startDate +
                    '/' +
                    router.query.endDate +
                    '/' +
                    day.date
                  }
                >
                  <a className='text-center inline-block py-2 px-4 bg-gray-300 rounded hover:bg-gray-400 hover:shadow-lg transition-all'>
                    {friendlyDate(day.date)} <br />
                    <span className='text-sm'>
                      {daysOfWeekNames[day.dayOfWeek]}
                    </span>
                  </a>
                </Link>
              );
            } else {
              return (
                <span
                  key={day.date}
                  className='text-center inline-block py-2 px-4 bg-gray-300 rounded text-gray-400 cursor-not-allowed'
                >
                  {friendlyDate(day.date)} <br />
                  <span className='text-sm'>
                    {daysOfWeekNames[day.dayOfWeek]}
                  </span>
                </span>
              );
            }
          })}
        </div>
      )}
    </>
  );
};

export default Agende;
