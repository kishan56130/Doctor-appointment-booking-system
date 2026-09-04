import Hero from '../components/Hero';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';

const Home = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8'>
      <Hero />
      <SpecialityMenu />
      <TopDoctors />



      <Banner />
    </div>
  );
};

export default Home;
