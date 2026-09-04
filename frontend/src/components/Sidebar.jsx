import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserPlus, 
  Users, 
  UserCheck 
} from 'lucide-react';

const Sidebar = ({ role = 'admin' }) => {
  return (
    <aside className='w-64 min-h-[calc(100vh-80px)] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200 flex flex-col py-6'>
      <div className='flex flex-col gap-2 px-4'>
        {role === 'admin' ? (
          <>
            <NavLink 
              to='/admin-dashboard/dashboard' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to='/admin-dashboard/appointments' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <CalendarDays size={18} />
              <span>Appointments</span>
            </NavLink>

            <NavLink 
              to='/admin-dashboard/add-doctor' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <UserPlus size={18} />
              <span>Add Doctor</span>
            </NavLink>

            <NavLink 
              to='/admin-dashboard/doctors-list' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <Users size={18} />
              <span>Doctors List</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to='/doctor-dashboard/dashboard' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to='/doctor-dashboard/appointments' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <CalendarDays size={18} />
              <span>Appointments</span>
            </NavLink>

            <NavLink 
              to='/doctor-dashboard/profile' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary'
                }`
              }
            >
              <UserCheck size={18} />
              <span>Profile Settings</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
