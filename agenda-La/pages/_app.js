import 'tailwindcss/tailwind.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <div className='max-w-7xl mx-auto shadow bg-gray-100 p-8 mt-2'>
        <Component {...pageProps} />
      </div>
      <Footer />
    </>
  );
}

export default MyApp;
