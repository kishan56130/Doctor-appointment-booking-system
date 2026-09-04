import { Mail, Phone, MapPin, Building } from 'lucide-react';

const Contact = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 text-slate-800 dark:text-slate-200 py-10 animate-fadeIn'>
      <div className='text-center text-2xl font-bold text-slate-800 dark:text-white mb-10'>
        <p>CONTACT <span className='text-primary'>US</span></p>
      </div>

      <div className='flex flex-col md:flex-row gap-12 justify-center items-center max-w-5xl mx-auto'>
        {/* Unsplash Image representing corporate office */}
        <div className='w-full md:w-[380px] aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl shadow-md border border-slate-100 dark:border-slate-800'>
          <img 
            className='w-full h-full object-cover' 
            src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=450&auto=format&fit=crop&q=80' 
            alt='Prescripto Office' 
          />
        </div>

        {/* Contact details */}
        <div className='flex flex-col gap-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed md:w-1/2'>
          <div>
            <h3 className='font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2'>
              <Building className='w-5 h-5 text-primary' /> OUR OFFICE
            </h3>
            <ul className='flex flex-col gap-3'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 text-slate-400 flex-shrink-0' />
                <span>456 Clinic Avenue, Suite 10, Medical District, NY 10001, USA</span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='w-5 h-5 text-slate-400 flex-shrink-0' />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-slate-400 flex-shrink-0' />
                <span>support@prescripto.com</span>
              </li>
            </ul>
          </div>

          <hr className='border-slate-200 dark:border-slate-800 my-2' />

          <div>
            <h3 className='font-bold text-slate-800 dark:text-white text-base mb-2'>Careers at Prescripto+</h3>
            <p className='mb-4 text-slate-500 dark:text-slate-400'>
              Learn more about our teams, open roles, and medical network partnerships.
            </p>
            <button className='border border-slate-300 dark:border-slate-700 px-6 py-3 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
