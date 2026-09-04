import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowRight, UserCheck } from 'lucide-react';

const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  return (
    <div className='flex bg-primary dark:bg-slate-900 rounded-3xl px-6 sm:px-10 md:px-14 lg:px-20 my-20 py-10 md:py-16 text-white overflow-hidden relative border border-primary/20 dark:border-slate-800/80 shadow-lg shadow-primary/5 max-w-7xl mx-auto'>
      {/* Background visual detail */}
      <div className='absolute right-0 top-0 w-92 h-92 bg-white/5 rounded-full blur-3xl pointer-events-none'></div>

      {/* Left Column */}
      <div className='flex-1 flex flex-col items-start justify-center gap-4 py-8 z-10 animate-fadeIn'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight'>
          Book Appointment <br />
          With 100+ Trusted Doctors
        </h2>
        
        <p className='text-white/80 text-xs sm:text-sm font-light max-w-sm mb-2'>
          Join thousands of patients who schedule, pay, and review their medical visits seamlessly online.
        </p>

        {token ? (
          <button
            onClick={() => { navigate('/doctors'); window.scrollTo(0,0); }}
            className='flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 active:scale-95 text-xs sm:text-sm'
          >
            Find a doctor
            <ArrowRight className='w-4 h-4' />
          </button>
        ) : (
          <button
            onClick={() => { navigate('/login'); window.scrollTo(0,0); }}
            className='flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 active:scale-95 text-xs sm:text-sm'
          >
            Create account
            <UserCheck className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Right Column (Simple graphic representation) */}
      <div className='hidden md:flex flex-1 justify-end items-center relative z-10 pr-6'>
        <div className='w-64 h-64 bg-white/10 rounded-full flex items-center justify-center border border-white/5 shadow-inner'>
          <svg viewBox="0 0 200 200" className="w-40 h-40 text-white/85" fill="currentColor">
            {/* Heart symbol with heartbeat rhythm */}
            <path d="M100 160 C100 160, 40 110, 40 70 C40 42, 65 20, 90 40 C95 44, 98 48, 100 50 C102 48, 105 44, 110 40 C135 20, 160 42, 160 70 C160 110, 100 160, 100 160 Z" />
            <path d="M60 85 H80 L88 70 L95 105 L102 60 L108 95 L114 80 H140" fill="none" stroke="#5F6FFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Banner;
