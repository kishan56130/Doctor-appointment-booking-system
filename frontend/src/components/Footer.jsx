import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 px-4 md:px-12 mt-20 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8'>
        {/* Brand description */}
        <div className='md:col-span-2 flex flex-col gap-4'>
          <Link to='/' className='flex items-center gap-2'>
            <Stethoscope className='w-7 h-7 text-primary' />
            <span className='font-bold text-lg tracking-tight text-slate-800 dark:text-white'>
              Prescripto<span className='text-primary font-black ml-0.5'>+</span>
            </span>
          </Link>
          <p className='text-sm leading-relaxed max-w-sm'>
            Prescripto is a digital-first healthcare platform helping patients connect with experienced, licensed doctors in real-time. Schedule consultations, manage prescriptions, and organize health logs securely.
          </p>
        </div>

        {/* Company Links */}
        <div className='flex flex-col gap-3'>
          <h4 className='font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase'>Company</h4>
          <ul className='flex flex-col gap-2 text-sm'>
            <li><Link to='/' className='hover:text-primary transition-colors'>Home</Link></li>
            <li><Link to='/about' className='hover:text-primary transition-colors'>About us</Link></li>
            <li><Link to='/contact' className='hover:text-primary transition-colors'>Contact us</Link></li>
            <li><a href='#' className='hover:text-primary transition-colors'>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className='flex flex-col gap-3'>
          <h4 className='font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase'>Get In Touch</h4>
          <ul className='flex flex-col gap-2 text-sm'>
            <li>Phone: +1-234-567-8900</li>
            <li>Email: support@prescripto.com</li>
            <li>Address: 456 Clinic Avenue, Suite 10, Medical District, NY 10001</li>
          </ul>
        </div>

        {/* Portals Links */}
        <div className='flex flex-col gap-3'>
          <h4 className='font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase'>Portals</h4>
          <ul className='flex flex-col gap-2 text-sm'>
            <li><Link to='/doctor-login' className='hover:text-primary transition-colors'>Doctor Portal</Link></li>
            <li><Link to='/admin-login' className='hover:text-primary transition-colors'>Admin Portal</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright footer */}
      <div className='border-t border-slate-100 dark:border-slate-800/80 mt-10 pt-6 text-center text-xs text-slate-500'>
        <p>&copy; {new Date().getFullYear()} Prescripto+. All rights reserved. Created with care for medical professionals.</p>
      </div>
    </footer>
  );
};

export default Footer;
