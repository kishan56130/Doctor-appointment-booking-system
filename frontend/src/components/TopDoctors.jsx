import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Star } from 'lucide-react';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-slate-900 dark:text-slate-100 px-4 md:px-0'>
      <h2 className='text-3xl font-bold tracking-tight text-center'>Top Doctors to Book</h2>
      <p className='sm:w-1/3 text-center text-sm text-slate-500 dark:text-slate-400'>
        Browse through our top-rated medical specialists and read verified feedback from other patients.
      </p>

      {/* Grid of Doctor Cards */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-10 px-2 max-w-7xl mx-auto'>
        {doctors.slice(0, 8).map((item, index) => (
          <div
            key={index}
            onClick={() => { navigate(`/doctor/${item._id}`); window.scrollTo(0,0); }}
            className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col'
          >
            {/* Image section */}
            <div className='relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden'>
              <img 
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                src={item.image} 
                alt={item.name} 
              />
              
              {/* Rating float overlay */}
              {item.rating > 0 && (
                <div className='absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-850 dark:text-slate-150 border border-slate-100 dark:border-slate-800 shadow-sm'>
                  <Star size={12} className='text-yellow-400 fill-yellow-400' />
                  <span>{item.rating}</span>
                </div>
              )}
            </div>

            {/* Details section */}
            <div className='p-5 flex flex-col flex-grow gap-2'>
              {/* Availability Status */}
              <div className='flex items-center gap-2 text-xs'>
                <span className={`w-2.5 h-2.5 rounded-full ${item.availability ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <p className={item.availability ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 font-medium'}>
                  {item.availability ? 'Available' : 'Unavailable'}
                </p>
              </div>

              <h3 className='font-bold text-base text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1'>
                {item.name}
              </h3>
              
              <p className='text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider'>
                {item.specialty}
              </p>

              <div className='flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80'>
                <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Fee</span>
                <span className='text-sm font-bold text-slate-800 dark:text-white'>{currencySymbol}{item.fees}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { navigate('/doctors'); window.scrollTo(0,0); }}
        className='bg-blue-50 hover:bg-primary hover:text-white dark:bg-slate-900 dark:border dark:border-slate-800 dark:hover:bg-slate-850 dark:hover:text-primary text-slate-600 dark:text-slate-350 px-10 py-3 rounded-full font-bold mt-10 transition-all duration-300 active:scale-95 text-sm shadow-sm'
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
