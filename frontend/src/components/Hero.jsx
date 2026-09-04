import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroDoctor from '../assets/hero_doctor.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary dark:bg-slate-900 rounded-3xl px-6 md:px-14 lg:px-20 py-12 md:py-20 text-white relative overflow-hidden transition-all shadow-xl shadow-primary/10 border border-primary/20 dark:border-slate-800/80'>
      {/* Decorative gradients */}
      <div className='absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none'></div>
      <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none'></div>

      {/* Left side text */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 z-10 animate-fadeIn'>
        <div className='inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/10'>
          <Sparkles className='w-4 h-4 text-yellow-300' />
          <span>EASY SCHEDULING PLATFORM</span>
        </div>
        
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight'>
          Book Appointment <br className='hidden md:block' />
          With Trusted Doctors
        </h1>
        
        <p className='text-white/80 text-sm md:text-base max-w-md font-light leading-relaxed'>
          Simply browse through our extensive list of trusted specialists, view their live availability, and schedule your appointment in under two minutes.
        </p>

        <button
          onClick={() => navigate('/doctors')}
          className='flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-full font-bold hover:gap-3 transition-all duration-300 hover:shadow-lg active:scale-95 text-sm'
        >
          Book appointment
          <ArrowRight className='w-4 h-4' />
        </button>
      </div>

      {/* Right side illustration */}
      <div className='md:w-1/2 relative flex justify-center items-end mt-10 md:mt-0 z-10'>
        <div className='relative w-full max-w-sm lg:max-w-md aspect-square md:aspect-auto md:h-[370px] flex items-end'>
          <img 
            src={heroDoctor} 
            alt="Doctor" 
            className="w-full h-auto object-contain max-h-[370px] drop-shadow-xl" 
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
