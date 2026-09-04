import { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { Save, UserCheck, Camera, Edit3, Shield, Mail, KeyRound, Smartphone, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const DoctorProfileSettings = () => {
  const { profileData, getProfile, updateProfile, loading } = useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [degree, setDegree] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  // Set local state when profileData is loaded
  useEffect(() => {
    if (profileData) {
      setName(profileData.name || '');
      setPhone(profileData.phone || '');
      setSpecialty(profileData.specialty || 'General Physician');
      setDegree(profileData.degree || '');
      setExperience(profileData.experience || '1 Year');
      setFees(profileData.fees || '');
      setAbout(profileData.about || '');
      setAvailability(profileData.availability);
      setPassword('');
    }
  }, [profileData]);

  const startEditing = () => {
    if (profileData) {
      setName(profileData.name || '');
      setPhone(profileData.phone || '');
      setSpecialty(profileData.specialty || 'General Physician');
      setDegree(profileData.degree || '');
      setExperience(profileData.experience || '1 Year');
      setFees(profileData.fees || '');
      setAbout(profileData.about || '');
      setAvailability(profileData.availability);
      setPassword('');
      setIsEdit(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('specialty', specialty);
      formData.append('degree', degree);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('availability', availability);

      if (password && password.trim() !== '') {
        formData.append('password', password);
      }
      if (image) {
        formData.append('image', image);
      }

      const success = await updateProfile(formData);
      if (success) {
        setIsEdit(false);
        setImage(false);
        setPassword('');
        getProfile(); // Refresh profile state
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (!profileData && loading) {
    return (
      <div className='flex items-center justify-center py-20 text-slate-500'>
        <p>Retrieving profile settings...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className='flex items-center justify-center py-20 text-slate-500'>
        <p>No profile settings record found.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 animate-fadeIn w-full max-w-4xl mx-auto py-6'>
      {/* Page Header */}
      <div>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2'>
          <UserCheck size={24} className='text-primary' /> Profile Settings
        </h2>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
          Modify consult details, upload profile photos, configure specialties and availability, or update biographical about logs.
        </p>
      </div>

      <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 transition-colors duration-200'>

        {/* Avatar Upload */}
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-50 dark:bg-slate-950 flex-shrink-0 group'>
            <img
              className='w-full h-full object-cover group-hover:opacity-75 transition-opacity'
              src={image ? URL.createObjectURL(image) : profileData.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
              alt='Doctor avatar'
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
              <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>{profileData.name}</h2>
            )}
            <p className='text-sm text-slate-400 font-light mt-1'>{profileData.email}</p>
          </div>
        </div>

        <hr className='border-slate-100 dark:border-slate-800/80' />

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 text-sm'>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

            {/* Left Column */}
            <div className='flex flex-col gap-4.5'>
              <div>
                <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Specialty</label>
                {isEdit ? (
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-150 outline-none focus:border-primary transition-colors font-medium'
                  >
                    <option value='General Physician'>General Physician</option>
                    <option value='Gynecologist'>Gynecologist</option>
                    <option value='Dermatologist'>Dermatologist</option>
                    <option value='Pediatrician'>Pediatrician</option>
                    <option value='Neurologist'>Neurologist</option>
                    <option value='Gastroenterologist'>Gastroenterologist</option>
                  </select>
                ) : (
                  <div className='flex items-center gap-2 text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850'>
                    <Sparkles size={16} className='text-slate-400' />
                    <span className='font-medium'>{profileData.specialty}</span>
                  </div>
                )}
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Qualifications / Degree</label>
                {isEdit ? (
                  <input
                    type='text'
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-medium'
                    required
                  />
                ) : (
                  <div className='flex items-center gap-2 text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850'>
                    <GraduationCap size={16} className='text-slate-400' />
                    <span className='font-medium'>{profileData.degree}</span>
                  </div>
                )}
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Experience</label>
                {isEdit ? (
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-150 outline-none focus:border-primary transition-colors font-medium'
                  >
                    <option value='1 Year'>1 Year</option>
                    <option value='2 Years'>2 Years</option>
                    <option value='3 Years'>3 Years</option>
                    <option value='4 Years'>4 Years</option>
                    <option value='5 Years'>5 Years</option>
                    <option value='6 Years'>6 Years</option>
                    <option value='8 Years'>8 Years</option>
                    <option value='10 Years'>10 Years</option>
                    <option value='12 Years'>12 Years</option>
                  </select>
                ) : (
                  <div className='flex items-center gap-2 text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850'>
                    <Briefcase size={16} className='text-slate-400' />
                    <span className='font-medium'>{profileData.experience}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className='flex flex-col gap-4.5'>
              <div>
                <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Contact Phone</label>
                {isEdit ? (
                  <input
                    type='text'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-medium'
                  />
                ) : (
                  <div className='flex items-center gap-2 text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850'>
                    <Smartphone size={16} className='text-slate-400' />
                    <span className='font-medium'>{profileData.phone || 'No phone number set'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Consultation Fee ({currencySymbol})</label>
                {isEdit ? (
                  <input
                    type='number'
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary text-slate-800 dark:text-white font-semibold transition-colors'
                    required
                  />
                ) : (
                  <div className='flex items-center gap-2 text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850 font-bold'>
                    <span>{currencySymbol}</span>
                    <span>{profileData.fees}</span>
                  </div>
                )}
              </div>

              <div className='flex flex-col justify-center pl-1'>
                <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Availability Toggle</span>
                {isEdit ? (
                  <label className='relative inline-flex items-center cursor-pointer w-fit mt-1'>
                    <input
                      type='checkbox'
                      checked={availability}
                      onChange={(e) => setAvailability(e.target.checked)}
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-355 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                ) : (
                  <div className='mt-1'>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${profileData.availability ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100' : 'bg-slate-50 text-slate-500 dark:bg-slate-950/20 dark:text-slate-400 border-slate-200'}`}>
                      {profileData.availability ? 'Available for Consults' : 'Temporarily Unavailable'}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <hr className='border-slate-100 dark:border-slate-800/80 my-1' />

          <div>
            <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Biography About</label>
            {isEdit ? (
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary text-slate-805 dark:text-white leading-relaxed font-light'
                required
              />
            ) : (
              <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850'>
                {profileData.about}
              </p>
            )}
          </div>

          <hr className='border-slate-100 dark:border-slate-800/80 my-1' />

          {/* Change Password Block */}
          <div>
            <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Security Settings</label>
            <div className='flex items-center gap-3 mt-1'>
              <KeyRound size={16} className='text-slate-400 flex-shrink-0' />
              <div className='flex-grow max-w-md'>
                {isEdit ? (
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Leave empty to keep current password'
                    className='bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 outline-none w-full text-slate-800 dark:text-white text-xs'
                  />
                ) : (
                  <p className='font-medium text-slate-400 text-xs'>••••••••••••</p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex justify-end gap-3 mt-4'>
            {isEdit ? (
              <>
                <button
                  type='button'
                  onClick={() => setIsEdit(false)}
                  className='border border-slate-300 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all active:scale-95 text-sm'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-8 py-2.5 rounded-xl font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:bg-slate-400 text-sm'
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </>
            ) : (
              <button
                type='button'
                onClick={startEditing}
                className='flex items-center gap-2 border border-slate-300 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all active:scale-95 text-sm'
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default DoctorProfileSettings;
