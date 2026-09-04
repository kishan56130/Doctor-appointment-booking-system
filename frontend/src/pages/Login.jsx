import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, KeyRound, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl } = useContext(AppContext);

  const [state, setState] = useState('Login'); // Login or Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect to home page if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Account Registered Successfully");
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Logged In Successfully");
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.warning('Please enter your email address to reset password');
      return;
    }
    toast.success(`Password reset verification link sent to: ${email}`);
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4 animate-fadeIn'>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none transition-colors duration-200'>
        {/* Title */}
        <div className='w-full'>
          <div className='flex items-center gap-2 mb-1'>
            <Sparkles className='w-5 h-5 text-primary' />
            <p className='text-2xl font-bold text-slate-850 dark:text-white capitalize'>
              Patient {state}
            </p>
          </div>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            {state === 'Login' ? 'Please log in to schedule your consults.' : 'Create an account to browse and book doctors.'}
          </p>
        </div>

        {/* Input Blocks */}
        <div className='w-full flex flex-col gap-4'>
          {state === 'Sign Up' && (
            <div className='w-full'>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Full Name</label>
              <div className='flex items-center gap-2 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950'>
                <User size={16} className='text-slate-400' />
                <input 
                  className='bg-transparent border-none outline-none w-full text-slate-800 dark:text-white text-sm' 
                  type='text' 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  placeholder="John Doe"
                  required 
                />
              </div>
            </div>
          )}

          <div className='w-full'>
            <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Email Address</label>
            <div className='flex items-center gap-2 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950'>
              <Mail size={16} className='text-slate-400' />
              <input 
                className='bg-transparent border-none outline-none w-full text-slate-800 dark:text-white text-sm' 
                type='email' 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                placeholder="user@prescripto.com"
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

        {/* Remember Me & Forgot Password (Only in Login mode) */}
        {state === 'Login' && (
          <div className='w-full flex items-center justify-between text-xs mt-1'>
            <label className='flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400'>
              <input 
                type='checkbox' 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className='rounded text-primary border-slate-350 dark:border-slate-700'
              />
              <span>Remember Me</span>
            </label>
            <span 
              onClick={handleForgotPassword} 
              className='text-primary font-semibold hover:underline cursor-pointer'
            >
              Forgot Password?
            </span>
          </div>
        )}

        {/* Submit */}
        <button 
          type='submit' 
          disabled={loading}
          className='w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold shadow-md shadow-primary/15 transition-all active:scale-95 disabled:bg-slate-400 text-sm mt-2'
        >
          {loading ? 'Processing...' : (state === 'Login' ? 'Login' : 'Create account')}
        </button>

        {/* State Toggle */}
        <div className='w-full flex flex-col gap-4 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/80'>
          <p>
            {state === 'Login' ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')} 
              className='text-primary font-bold cursor-pointer hover:underline'
            >
              {state === 'Login' ? 'Click here' : 'Login here'}
            </span>
          </p>

          {/* Portals gateway */}
          <div className='flex justify-between font-semibold text-primary pt-2'>
            <span onClick={() => navigate('/doctor-login')} className='cursor-pointer hover:underline'>Doctor Portal</span>
            <span onClick={() => navigate('/admin-login')} className='cursor-pointer hover:underline'>Admin Portal</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
