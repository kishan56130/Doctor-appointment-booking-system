import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { ChevronDown, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const { aToken, setAToken, adminData } = useContext(AdminContext);
  const { darkMode, toggleDarkMode } = useContext(AppContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const adminLogout = () => {
    setAToken('');
    sessionStorage.removeItem('aToken');
    navigate('/');
  };

  useEffect(() => {
    // If no admin token, redirect to login page
    if (!aToken) {
      navigate('/admin-login');
    }
  }, [aToken]);

  if (!aToken) {
    return null;
  }

  return (
    <div className='flex items-start bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-200'>
      {/* Admin Sidebar */}
      <Sidebar role='admin' />

      {/* Main Content Area */}
      <main className='flex-1 flex flex-col min-h-screen max-h-screen overflow-y-auto w-full'>
        {/* Admin Header */}
        <header className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-10 flex items-center justify-between transition-colors duration-200 sticky top-0 z-40 shadow-sm flex-shrink-0'>
          <div className='flex items-center gap-2'>
            <span className='px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300 rounded-full border border-red-200 dark:border-red-900/30'>
              Admin Panel
            </span>
          </div>

          <div className='flex items-center gap-4.5'>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className='p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 transition-colors'
              aria-label='Toggle dark mode'
            >
              {darkMode ? <Sun className='w-4.5 h-4.5 text-yellow-500' /> : <Moon className='w-4.5 h-4.5' />}
            </button>

            {/* Admin Profile Dropdown */}
            <div className='relative flex items-center gap-2 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)}>
              <img 
                className='w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm' 
                src={adminData?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'} 
                alt='Admin avatar' 
              />
              <span className='hidden sm:inline text-xs font-bold text-slate-750 dark:text-slate-250'>{adminData?.name || 'System Admin'}</span>
              <ChevronDown className='w-3.5 h-3.5 text-slate-400' />

              {showDropdown && (
                <div className='absolute top-10 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-xl py-2.5 z-50 text-slate-650 dark:text-slate-350 animate-fadeIn font-semibold text-xs border-t-4 border-t-primary'>
                  <div className='px-4 py-1.5 border-b border-slate-100 dark:border-slate-850 pb-2 mb-1.5'>
                    <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>Logged in as</p>
                    <p className='text-[11px] text-slate-700 dark:text-white truncate font-extrabold mt-0.5'>{adminData?.email || 'admin@prescripto.com'}</p>
                  </div>
                  
                  <p 
                    onClick={() => navigate('/admin-dashboard/profile')} 
                    className='px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary cursor-pointer transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-300'
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </p>
                  
                  <hr className='border-slate-100 dark:border-slate-850 my-1.5' />
                  
                  <p 
                    onClick={adminLogout} 
                    className='px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 text-red-500 cursor-pointer transition-colors flex items-center gap-2'
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className='flex-grow p-6 md:p-10 overflow-y-auto w-full'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
