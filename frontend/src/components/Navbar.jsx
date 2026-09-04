import { useContext, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { Menu, X, ChevronDown, Sun, Moon, Stethoscope } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  const { token, setToken, userData, setUserData, darkMode, toggleDarkMode } = useContext(AppContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const logout = () => {
    // Clear user tokens
    setToken('');
    localStorage.removeItem('token');
    setUserData(false);
    
    // Clear Admin / Doctor sessions if logout was triggered
    setAToken('');
    sessionStorage.removeItem('aToken');
    setDToken('');
    localStorage.removeItem('dToken');
    
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-slate-200 dark:border-b-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 px-4 md:px-12 transition-colors duration-200'>
      {/* Brand Logo */}
      <Link to='/' className='flex items-center gap-2 cursor-pointer'>
        <Stethoscope className='w-8 h-8 text-primary' />
        <span className='font-bold text-xl tracking-tight text-slate-800 dark:text-white flex items-center'>
          Prescripto<span className='text-primary font-black ml-0.5'>+</span>
        </span>
      </Link>

      {/* Center Links (Patient facing) */}
      <ul className='hidden md:flex items-center gap-6 font-medium text-slate-600 dark:text-slate-300'>
        <NavLink to='/' className={({ isActive }) => `py-1 transition-all hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary' : ''}`}>
          <li>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => `py-1 transition-all hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary' : ''}`}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => `py-1 transition-all hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary' : ''}`}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => `py-1 transition-all hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary' : ''}`}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      {/* Right Navigation Elements */}
      <div className='flex items-center gap-4'>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className='p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors'
          aria-label='Toggle dark mode'
        >
          {darkMode ? <Sun className='w-5 h-5 text-yellow-500' /> : <Moon className='w-5 h-5' />}
        </button>

        {/* Dynamic Auth display */}
        {token ? (
          // Logged-in Patient Profile Dropdown
          <div className='relative flex items-center gap-2 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)}>
            <img 
              className='w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700' 
              src={userData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
              alt='Profile avatar' 
            />
            <ChevronDown className='w-4 h-4 text-slate-500' />
            
            {showDropdown && (
              <div className='absolute top-10 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-lg py-2 z-50 text-slate-600 dark:text-slate-300 animate-fadeIn'>
                <p onClick={() => navigate('/my-profile')} className='px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary cursor-pointer transition-colors'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary cursor-pointer transition-colors'>My Appointments</p>
                <hr className='border-slate-100 dark:border-slate-800 my-1' />
                <p onClick={logout} className='px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500 cursor-pointer transition-colors'>Logout</p>
              </div>
            )}
          </div>
        ) : aToken ? (
          // Logged-in Admin Indicator
          <div className='flex items-center gap-2'>
            <span className='px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full border border-red-200 dark:border-red-800/40'>Admin Panel</span>
            <button onClick={() => navigate('/admin-dashboard')} className='bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary/95 transition-all text-xs md:text-sm shadow-sm'>Dashboard</button>
            <button onClick={logout} className='border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-full font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-all'>Logout</button>
          </div>
        ) : dToken ? (
          // Logged-in Doctor Indicator
          <div className='flex items-center gap-2'>
            <span className='px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800/40'>Doctor Panel</span>
            <button onClick={() => navigate('/doctor-dashboard')} className='bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary/95 transition-all text-xs md:text-sm shadow-sm'>Dashboard</button>
            <button onClick={logout} className='border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-full font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-all'>Logout</button>
          </div>
        ) : (
          // Login Dropdown (Option A)
          <div className='relative hidden md:block'>
            <button
              onClick={() => setShowLoginDropdown(!showLoginDropdown)}
              className='flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm'
            >
              <span>Login Portal</span>
              <ChevronDown className='w-4 h-4' />
            </button>
            
            {showLoginDropdown && (
              <div className='absolute top-11 right-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2.5 z-50 text-slate-600 dark:text-slate-300 animate-fadeIn font-semibold text-xs border-t-4 border-t-primary'>
                <p 
                  onClick={() => { setShowLoginDropdown(false); navigate('/login'); }} 
                  className='px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary cursor-pointer transition-colors'
                >
                  Patient Login
                </p>
                <p 
                  onClick={() => { setShowLoginDropdown(false); navigate('/doctor-login'); }} 
                  className='px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary cursor-pointer transition-colors'
                >
                  Doctor Login
                </p>
                <p 
                  onClick={() => { setShowLoginDropdown(false); navigate('/admin-login'); }} 
                  className='px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary cursor-pointer transition-colors'
                >
                  Admin Login
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className='md:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          aria-label='Toggle menu'
        >
          {showMobileMenu ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className='md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg py-4 px-6 z-40 text-slate-700 dark:text-slate-200 flex flex-col gap-4 animate-fadeIn transition-colors duration-200'>
          <NavLink to='/' onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `py-2 font-medium hover:text-primary ${isActive ? 'text-primary' : ''}`}>
            HOME
          </NavLink>
          <NavLink to='/doctors' onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `py-2 font-medium hover:text-primary ${isActive ? 'text-primary' : ''}`}>
            ALL DOCTORS
          </NavLink>
          <NavLink to='/about' onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `py-2 font-medium hover:text-primary ${isActive ? 'text-primary' : ''}`}>
            ABOUT
          </NavLink>
          <NavLink to='/contact' onClick={() => setShowMobileMenu(false)} className={({ isActive }) => `py-2 font-medium hover:text-primary ${isActive ? 'text-primary' : ''}`}>
            CONTACT
          </NavLink>
          {!token && !aToken && !dToken && (
            <div className='flex flex-col gap-2 mt-2'>
              <button
                onClick={() => { setShowMobileMenu(false); navigate('/login'); }}
                className='bg-primary text-white py-2.5 rounded-xl text-center w-full text-xs font-bold'
              >
                Patient Login
              </button>
              <button
                onClick={() => { setShowMobileMenu(false); navigate('/doctor-login'); }}
                className='bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-center w-full text-xs font-bold border border-slate-200 dark:border-slate-750'
              >
                Doctor Login
              </button>
              <button
                onClick={() => { setShowMobileMenu(false); navigate('/admin-login'); }}
                className='bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-center w-full text-xs font-bold border border-slate-200 dark:border-slate-750'
              >
                Admin Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
