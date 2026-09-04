import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { 
  Trash2, 
  Edit, 
  X, 
  Save, 
  Camera, 
  Stethoscope 
} from 'lucide-react';
import { toast } from 'react-toastify';

const DoctorsList = () => {
  const { doctors, getAllDoctors, changeAvailability, updateDoctor, deleteDoctor, loading } = useContext(AdminContext);

  // Edit Modal States
  const [editingDoc, setEditingDoc] = useState(null);
  const [editImg, setEditImg] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editDegree, setEditDegree] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editFees, setEditFees] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editAvailability, setEditAvailability] = useState(true);

  useEffect(() => {
    getAllDoctors();
  }, []);

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setEditName(doc.name);
    setEditSpecialty(doc.specialty);
    setEditDegree(doc.degree);
    setEditExperience(doc.experience);
    setEditFees(doc.fees);
    setEditAbout(doc.about);
    setEditAvailability(doc.availability);
    setEditImg(false);
  };

  const closeEditModal = () => {
    setEditingDoc(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('docId', editingDoc._id);
      formData.append('name', editName);
      formData.append('specialty', editSpecialty);
      formData.append('degree', editDegree);
      formData.append('experience', editExperience);
      formData.append('fees', Number(editFees));
      formData.append('about', editAbout);
      formData.append('availability', editAvailability);

      if (editImg) {
        formData.append('image', editImg);
      }

      const success = await updateDoctor(formData);
      if (success) {
        closeEditModal();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this doctor's profile? This action is irreversible.")) {
      await deleteDoctor(docId);
    }
  };

  return (
    <div className='flex flex-col gap-6 animate-fadeIn w-full'>
      {/* Page Header */}
      <div>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2'>
          <Stethoscope size={24} className='text-primary' /> Doctor Directory
        </h2>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
          Browse the full listing of registered doctors, toggle client-facing availability, or edit/delete profiles.
        </p>
      </div>

      {loading && doctors.length === 0 ? (
        <div className='flex justify-center items-center py-20 text-slate-500'>
          <p>Retrieving directory listings...</p>
        </div>
      ) : doctors.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {doctors.map((item, index) => (
            <div 
              key={index} 
              className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col group transition-colors duration-200'
            >
              {/* Image and quick actions */}
              <div className='relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                <img 
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                  src={item.image} 
                  alt={item.name} 
                />
                
                {/* Actions overlay */}
                <div className='absolute top-3 right-3 flex items-center gap-2'>
                  <button 
                    onClick={() => openEditModal(item)}
                    className='p-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-850 rounded-xl hover:text-primary transition-colors text-slate-600 dark:text-slate-300 shadow-sm'
                    title='Edit Profile'
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className='p-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-850 rounded-xl hover:text-red-500 transition-colors text-slate-600 dark:text-slate-300 shadow-sm'
                    title='Delete Profile'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Description body */}
              <div className='p-5 flex flex-col flex-grow gap-2'>
                <h3 className='font-bold text-sm text-slate-800 dark:text-white line-clamp-1'>{item.name}</h3>
                <p className='text-[10px] text-slate-400 font-semibold uppercase tracking-wider'>{item.specialty}</p>
                
                <hr className='border-slate-100 dark:border-slate-800/80 my-1' />

                {/* Availability Toggle */}
                <div className='flex items-center justify-between mt-auto pt-2'>
                  <span className='text-xs text-slate-500 dark:text-slate-400 font-medium'>Availability</span>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input 
                      type='checkbox' 
                      checked={item.availability} 
                      onChange={() => changeAvailability(item._id, item.availability)}
                      className='sr-only peer' 
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className='flex flex-col items-center justify-center py-20 text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 w-full shadow-sm'>
          <p className='text-lg font-bold text-slate-750 dark:text-slate-300'>No Doctors Registered</p>
          <p className='text-sm max-w-xs text-center mt-1'>There are currently no doctor profiles in the database system.</p>
        </div>
      )}

      {/* Edit Profile Modal Dialog */}
      {editingDoc && (
        <div className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4'>
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn'>
            
            {/* Modal Header */}
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-lg font-bold text-slate-800 dark:text-white'>Edit Doctor Details</h3>
                <p className='text-xs text-slate-400 mt-0.5'>{editingDoc.email}</p>
              </div>
              <button 
                onClick={closeEditModal} 
                className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors'
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className='flex flex-col gap-5 text-sm'>
              {/* Photo Upload */}
              <div className='flex items-center gap-4'>
                <div className='relative w-16 h-16 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center cursor-pointer group'>
                  <img 
                    className='w-full h-full object-cover' 
                    src={editImg ? URL.createObjectURL(editImg) : editingDoc.image} 
                    alt='Preview' 
                  />
                  <label htmlFor='edit-img-picker' className='absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                    <Camera size={14} className='text-white' />
                    <input 
                      type='file' 
                      id='edit-img-picker' 
                      onChange={(e) => setEditImg(e.target.files[0])} 
                      className='hidden' 
                      accept='image/*'
                    />
                  </label>
                </div>
                <div>
                  <p className='font-semibold text-slate-750 dark:text-slate-350'>Update Photo</p>
                  <p className='text-[10px] text-slate-400'>Click photo bubble to swap image.</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Name</label>
                  <input 
                    type='text' 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary' 
                    required 
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Specialty</label>
                  <select 
                    value={editSpecialty} 
                    onChange={(e) => setEditSpecialty(e.target.value)} 
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary'
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
                  <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Degree</label>
                  <input 
                    type='text' 
                    value={editDegree} 
                    onChange={(e) => setEditDegree(e.target.value)} 
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary' 
                    required 
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Experience</label>
                  <select 
                    value={editExperience} 
                    onChange={(e) => setEditExperience(e.target.value)} 
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary'
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

                <div>
                  <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Consultation Fee (₹)</label>
                  <input 
                    type='number' 
                    value={editFees} 
                    onChange={(e) => setEditFees(e.target.value)} 
                    className='w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary' 
                    required 
                  />
                </div>

                <div className='flex flex-col justify-center pl-1'>
                  <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Availability Toggle</span>
                  <label className='relative inline-flex items-center cursor-pointer w-fit mt-1'>
                    <input 
                      type='checkbox' 
                      checked={editAvailability} 
                      onChange={(e) => setEditAvailability(e.target.checked)}
                      className='sr-only peer' 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-355 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className='text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5'>Biography About</label>
                <textarea 
                  rows={3} 
                  value={editAbout} 
                  onChange={(e) => setEditAbout(e.target.value)} 
                  className='w-full border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950 outline-none focus:border-primary' 
                  required 
                />
              </div>

              <button 
                type='submit' 
                className='w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-2'
              >
                <Save size={16} /> Save Updated Details
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorsList;
