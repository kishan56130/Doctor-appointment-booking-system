import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Baby, 
  Sparkles, 
  Smile, 
  Brain, 
  Flame 
} from 'lucide-react';

const specialities = [
  { name: 'General Physician', icon: HeartPulse, bg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' },
  { name: 'Gynecologist', icon: Baby, bg: 'bg-pink-50 dark:bg-pink-950/20 text-pink-600' },
  { name: 'Dermatologist', icon: Sparkles, bg: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600' },
  { name: 'Pediatrician', icon: Smile, bg: 'bg-green-50 dark:bg-green-950/20 text-green-600' },
  { name: 'Neurologist', icon: Brain, bg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' },
  { name: 'Gastroenterologist', icon: Flame, bg: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600' },
];

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-slate-800 dark:text-slate-200' id='speciality'>
      <h2 className='text-3xl font-bold tracking-tight text-center'>Find by Speciality</h2>
      <p className='sm:w-1/3 text-center text-sm text-slate-500 dark:text-slate-400'>
        Simply browse through our extensive list of trusted doctors, scheduling your appointments hassle-free.
      </p>
      
      <div className='flex sm:justify-center gap-6 pt-8 w-full overflow-scroll scrollbar-none px-4'>
        {specialities.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={`/doctors/${item.name}`}
              className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-300 group'
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${item.bg} border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-all`}>
                <Icon size={32} className='group-hover:scale-110 transition-transform duration-300' />
              </div>
              <p className='text-slate-600 dark:text-slate-300 font-medium mt-3 text-center group-hover:text-primary transition-colors'>{item.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SpecialityMenu;
