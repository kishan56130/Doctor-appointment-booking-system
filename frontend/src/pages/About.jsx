import { Stethoscope, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 text-slate-800 dark:text-slate-200 py-10 animate-fadeIn'>
      <div className='text-center text-2xl font-bold text-slate-800 dark:text-white mb-10'>
        <p>ABOUT <span className='text-primary'>US</span></p>
      </div>

      {/* Main info container */}
      <div className='flex flex-col md:flex-row gap-12 items-center mb-16'>
        <div className='w-full md:w-[350px] aspect-[4/5] overflow-hidden rounded-2xl shadow-md border border-slate-100 dark:border-slate-800'>
          <img 
            className='w-full h-full object-cover' 
            src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=450&auto=format&fit=crop&q=80' 
            alt='Doctors discussing records' 
          />
        </div>
        
        <div className='flex-1 flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
          <p>
            Welcome to Prescripto+, your trusted partner in managing your healthcare needs. We understand that finding the right doctor and scheduling appointments can often be stressful and time-consuming. Our mission is to simplify this process, bridging the gap between expert medical advice and patient convenience.
          </p>
          <p>
            Prescripto+ is continuously structured to give patients comprehensive access to a vetted network of specialists across key healthcare disciplines. From general physicians to neurologists, we provide full transparency on doctors' backgrounds, degrees, experience, and consult fees, helping you make informed decisions.
          </p>
          <div className='mt-2'>
            <h3 className='font-bold text-slate-800 dark:text-white text-base mb-3 flex items-center gap-2'>
              <Eye className='w-5 h-5 text-primary' /> Our Vision
            </h3>
            <p>
              Our vision is to create a seamless healthcare ecosystem where patient scheduling, digital payments, and consultation logs are fully automated, giving doctors more time for diagnostics, and patients faster, more accessible medical consultations.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className='text-xl font-bold text-slate-800 dark:text-white mb-8'>
        <p>WHY <span className='text-primary'>CHOOSE US</span></p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Card 1 */}
        <div className='border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-primary dark:hover:border-primary transition-all duration-300 flex flex-col gap-4 bg-white dark:bg-slate-900 shadow-sm'>
          <div className='w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 text-primary flex items-center justify-center'>
            <ShieldCheck size={24} />
          </div>
          <h4 className='font-bold text-slate-800 dark:text-white text-base'>Efficiency & Speed</h4>
          <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
            Book appointments in under two minutes with active schedule logs, eliminating queue lines and phone hold-times.
          </p>
        </div>

        {/* Card 2 */}
        <div className='border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-primary dark:hover:border-primary transition-all duration-300 flex flex-col gap-4 bg-white dark:bg-slate-900 shadow-sm'>
          <div className='w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center'>
            <HeartHandshake size={24} />
          </div>
          <h4 className='font-bold text-slate-800 dark:text-white text-base'>Vetted Specialists</h4>
          <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
            Access profiles with verified degrees, reviews, ratings, and active licenses to guarantee maximum care standards.
          </p>
        </div>

        {/* Card 3 */}
        <div className='border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-primary dark:hover:border-primary transition-all duration-300 flex flex-col gap-4 bg-white dark:bg-slate-900 shadow-sm'>
          <div className='w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center'>
            <Stethoscope size={24} />
          </div>
          <h4 className='font-bold text-slate-800 dark:text-white text-base'>Digital Healthcare Logs</h4>
          <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
            Keep track of past appointment logs, invoices, and billing statuses in a highly secure user dashboard environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
