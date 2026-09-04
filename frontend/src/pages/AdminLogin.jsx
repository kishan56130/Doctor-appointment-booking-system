import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShieldAlert, KeyRound, Mail } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { aToken, setAToken, backendUrl } = useContext(AdminContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to Admin Dashboard
  useEffect(() => {
    if (aToken) {
      navigate('/admin-dashboard/dashboard');
    }
  }, [aToken]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
      if (data.success) {
        sessionStorage.setItem('aToken', data.token);
        setAToken(data.token);
        toast.success("Admin Session Authorized");
        navigate('/admin-dashboard/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4 animate-fadeIn'>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none transition-colors duration-200'>
        {/* Header Title */}
        <div className='w-full'>
          <div className='flex items-center gap-2 mb-1'>
            <ShieldAlert className='w-6 h-6 text-red-500' />
            <p className='text-2xl font-bold text-slate-850 dark:text-white'>Admin Login</p>
          </div>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Restricted environment. Enter administrator keys to access backend configurations.
          </p>
        </div>

        {/* Input Blocks */}
        <div className='w-full flex flex-col gap-4'>
          <div className='w-full'>
            <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Email Address</label>
            <div className='flex items-center gap-2 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950'>
              <Mail size={16} className='text-slate-400' />
              <input 
                className='bg-transparent border-none outline-none w-full text-slate-800 dark:text-white text-sm' 
                type='email' 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                placeholder="admin@prescripto.com"
                required 
              />
            </div>
          </div>

          <div className='w-full'>
            <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Password</label>
            <div className='flex items-center gap-2 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950'>
              <KeyRound size={16} className='text-slate-400' />
              <input 
                className='bg-transparent border-none outline-none w-full text-slate-800 dark:text-white text-sm' 
                type='password' 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button 
          type='submit' 
          disabled={loading}
          className='w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md shadow-red-500/10 transition-all active:scale-95 disabled:bg-slate-400 text-sm mt-2'
        >
          {loading ? 'Verifying Admin Status...' : 'Authorize Secure Access'}
        </button>

        {/* Direct Link Switchers */}
        <div className='w-full flex justify-between text-xs text-primary font-semibold pt-4 border-t border-slate-100 dark:border-slate-800/80'>
          <span onClick={() => navigate('/login')} className='cursor-pointer hover:underline'>Patient Login</span>
          <span onClick={() => navigate('/doctor-login')} className='cursor-pointer hover:underline'>Doctor Portal</span>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
