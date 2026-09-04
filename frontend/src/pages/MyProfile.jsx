import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, Edit3, Save, User, MapPin, Calendar, Smartphone, Landmark } from 'lucide-react';

const MyProfile = () => {
  const { token, userData, setUserData, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize edit fields
  const startEditing = () => {
    setName(userData.name);
    setPhone(userData.phone || '0000000000');
    setAddressLine1(userData.address?.line1 || '');
    setAddressLine2(userData.address?.line2 || '');
    setGender(userData.gender || 'Not Selected');
    setDob(userData.dob || 'Not Selected');
    setIsEdit(true);
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('gender', gender);
      formData.append('dob', dob);
      
      const addressObj = { line1: addressLine1, line2: addressLine2 };
      formData.append('address', JSON.stringify(addressObj));

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className='flex items-center justify-center min-h-[50vh] text-slate-500'>
        <p>Loading patient profile details...</p>
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
              src={image ? URL.createObjectURL(image) : userData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'} 
              alt='Profile avatar' 
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
              <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>{userData.name}</h2>
            )}
            <p className='text-sm text-slate-400 font-light mt-1'>{userData.email}</p>
          </div>
        </div>

        <hr className='border-slate-100 dark:border-slate-800/80' />

        {/* Contact details */}
        <div className='flex flex-col gap-4'>
          <h3 className='font-bold text-slate-400 text-xs uppercase tracking-widest'>Contact Information</h3>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-3'>
              <Smartphone size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Phone Number</p>
                {isEdit ? (
                  <input 
                    type='text' 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 outline-none w-full text-slate-800 dark:text-white' 
                  />
                ) : (
                  <p className='font-medium'>{userData.phone}</p>
                )}
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <MapPin size={16} className='text-slate-400 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Address Details</p>
                {isEdit ? (
                  <div className='flex flex-col gap-1.5 w-full'>
                    <input 
                      type='text' 
                      value={addressLine1} 
                      onChange={(e) => setAddressLine1(e.target.value)} 
                      placeholder='Line 1'
                      className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 outline-none w-full text-slate-800 dark:text-white' 
                    />
                    <input 
                      type='text' 
                      value={addressLine2} 
                      onChange={(e) => setAddressLine2(e.target.value)} 
                      placeholder='Line 2'
                      className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 outline-none w-full text-slate-800 dark:text-white' 
                    />
                  </div>
                ) : (
                  <p className='font-medium leading-tight'>
                    {userData.address?.line1 || 'No street details set'} <br />
                    {userData.address?.line2 || ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className='border-slate-100 dark:border-slate-800/80' />

        {/* Basic Details */}
        <div className='flex flex-col gap-4'>
          <h3 className='font-bold text-slate-400 text-xs uppercase tracking-widest'>Personal Information</h3>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-3'>
              <Landmark size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Gender</p>
                {isEdit ? (
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 outline-none w-full text-slate-850 dark:text-slate-150'
                  >
                    <option value='Not Selected'>Not Selected</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>
                ) : (
                  <p className='font-medium'>{userData.gender}</p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Calendar size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5'>Birthday</p>
                {isEdit ? (
                  <input 
                    type='date' 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 outline-none w-full text-slate-800 dark:text-white' 
                  />
                ) : (
                  <p className='font-medium'>{userData.dob}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className='mt-4 flex justify-end'>
          {isEdit ? (
            <button
              onClick={updateProfile}
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

export default MyProfile;
