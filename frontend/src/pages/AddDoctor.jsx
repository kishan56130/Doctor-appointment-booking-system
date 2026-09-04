import { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Camera, Save, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const AddDoctor = () => {
  const { addDoctor, loading } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [degree, setDegree] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docImg) {
      toast.warning('Please select a doctor photo');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('specialty', specialty);
      formData.append('degree', degree);

      const success = await addDoctor(formData);
      if (success) {
        // Reset state
        setName('');
        setEmail('');
        setPassword('');
        setFees('');
        setAbout('');
        setDegree('');
        setDocImg(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-6 animate-fadeIn w-full max-w-4xl mx-auto'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2'>
          <UserPlus size={24} className='text-primary' /> Add Doctor Profile
        </h2>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
          Register a new medical practitioner, configure consult fees, set specialty details, and upload profile photos.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 transition-colors duration-200'>
        
        {/* Upload doctor photo */}
        <div className='flex items-center gap-5'>
          <div className='relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors'>
            {docImg ? (
              <img className='w-full h-full object-cover' src={URL.createObjectURL(docImg)} alt='Doctor image' />
            ) : (
              <Camera className='w-6 h-6 text-slate-400' />
            )}
            <label htmlFor='doc-img' className='absolute inset-0 cursor-pointer opacity-0'>
              <input 
                onChange={(e) => setDocImg(e.target.files[0])} 
                type='file' 
                id='doc-img' 
                className='hidden' 
                accept='image/*'
              />
            </label>
          </div>
          <div>
            <p className='text-sm font-semibold text-slate-750 dark:text-slate-350'>Upload doctor photo</p>
            <p className='text-[10px] text-slate-400 mt-0.5'>Allowed file formats: JPG, PNG. Max size 2MB.</p>
          </div>
        </div>

        <hr className='border-slate-100 dark:border-slate-800/80 my-1' />

        {/* Form fields layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm'>
          {/* Left Column */}
          <div className='flex flex-col gap-4.5'>
            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Doctor Name</label>
              <input 
                type='text' 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Dr. Name'
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors' 
                required 
              />
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Doctor Email</label>
              <input 
                type='email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='doctor@prescripto.com'
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors' 
                required 
              />
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Doctor Password</label>
              <input 
                type='password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Min 8 characters'
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors' 
                required 
              />
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Experience</label>
              <select 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-150 outline-none focus:border-primary transition-colors'
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
            </div>
          </div>

          {/* Right Column */}
          <div className='flex flex-col gap-4.5'>
            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Speciality</label>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-150 outline-none focus:border-primary transition-colors'
              >
                <option value='General Physician'>General Physician</option>
                <option value='Gynecologist'>Gynecologist</option>
                <option value='Dermatologist'>Dermatologist</option>
                <option value='Pediatrician'>Pediatrician</option>
                <option value='Neurologist'>Neurologist</option>
                <option value='Gastroenterologist'>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Fees</label>
              <input 
                type='number' 
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder='Consult fee amount'
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors' 
                required 
              />
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>Education degree</label>
              <input 
                type='text' 
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder='MBBS, MD etc'
                className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors' 
                required 
              />
            </div>
          </div>
        </div>

        {/* Full width about box */}
        <div className='text-sm'>
          <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5'>About Doctor</label>
          <textarea 
            rows={4}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='Biography and expertise details...'
            className='w-full border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors'
            required
          />
        </div>

        {/* Submit */}
        <div className='flex justify-end mt-4'>
          <button 
            type='submit'
            disabled={loading}
            className='flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:bg-slate-400 text-sm'
          >
            <Save size={16} />
            {loading ? 'Creating...' : 'Save Doctor'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddDoctor;
