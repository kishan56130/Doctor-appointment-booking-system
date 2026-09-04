import { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Camera, Edit3, Save, KeyRound, User, Mail, Shield } from 'lucide-react';

const AdminProfile = () => {
  const { adminData, updateAdminProfile, loading } = useContext(AdminContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const startEditing = () => {
    setName(adminData.name);
    setPassword('');
    setIsEdit(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (password && password.trim() !== '') {
      formData.append('password', password);
    }
    if (image) {
      formData.append('image', image);
    }

    const success = await updateAdminProfile(formData);
    if (success) {
      setIsEdit(false);
      setImage(false);
      setPassword('');
    }
  };

  if (!adminData) {
    return (
      <div className='flex items-center justify-center min-h-[50vh] text-slate-500'>
        <p>Loading admin profile details...</p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto px-4 py-8 text-slate-800 dark:text-slate-200 animate-fadeIn'>
      <div className='flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200'>
        
        {/* Avatar Upload */}
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-50 dark:bg-slate-950 flex-shrink-0 group'>
            <img 
              className='w-full h-full object-cover group-hover:opacity-75 transition-opacity' 
              src={image ? URL.createObjectURL(image) : adminData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'} 
              alt='Admin avatar' 
            />
            {isEdit && (
              <label htmlFor='avatar' className='absolute inset-0 bg-slate-900/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'>
                <Camera size={20} className='text-white' />
                <input 
                  type='file' 
                  id='avatar' 
                  onChange={(e) => setImage(e.target.files[0])} 
                  className='hidden' 
                  accept='image/*'
                />
              </label>
            )}
          </div>

          <div className='text-center sm:text-left flex-1'>
            {isEdit ? (
              <input 
                type='text' 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='text-2xl font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-primary w-full max-w-sm' 
                required 
              />
            ) : (
              <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>{adminData.name}</h2>
            )}
            <p className='text-sm text-slate-400 font-light mt-1'>{adminData.email}</p>
          </div>
        </div>

        <hr className='border-slate-100 dark:border-slate-800/80' />

        {/* Basic Details */}
        <div className='flex flex-col gap-4'>
          <h3 className='font-bold text-slate-400 text-xs uppercase tracking-widest'>Admin Information</h3>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-3'>
              <Shield size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Role</p>
                <p className='font-medium text-red-500 dark:text-red-400 capitalize'>{adminData.role || 'Admin'}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Mail size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Account Email</p>
                <p className='font-medium'>{adminData.email}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className='border-slate-100 dark:border-slate-800/80' />

        {/* Security details */}
        <div className='flex flex-col gap-4'>
          <h3 className='font-bold text-slate-400 text-xs uppercase tracking-widest'>Security Settings</h3>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-3 col-span-2'>
              <KeyRound size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Change Password</p>
                {isEdit ? (
                  <input 
                    type='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Leave empty to keep current password'
                    className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 outline-none w-full text-slate-800 dark:text-white max-w-sm mt-1' 
                  />
                ) : (
                  <p className='font-medium text-slate-400'>••••••••••••</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className='mt-4 flex justify-end'>
          {isEdit ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className='flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-primary/10 transition-all active:scale-95 text-sm disabled:bg-slate-400'
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          ) : (
            <button
              onClick={startEditing}
              className='flex items-center gap-2 border border-slate-300 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all active:scale-95 text-sm'
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
