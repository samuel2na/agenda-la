const Footer = () => {
  return (
    <footer className='mt-12 text-center'>
      {/* <img src="/caderno.png" width={25} /> */}
      <p className='font-bold'>Agenda Lá</p>
      <p>Desenvolvedor responsável pelo projeto</p>
      <p>
        <a
          className='text-yellow-800 hover:text-blue-900'
          href='https://www.linkedin.com/in/samuel2na/'
        >
          {' '}
          Linkedin Samuel{' '}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
