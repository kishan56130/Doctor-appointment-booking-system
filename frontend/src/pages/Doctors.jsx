import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Star, Search, FilterX } from 'lucide-react';

const specialties = [
  'General Physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Gastroenterologist'
];

const Doctors = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();

  const { doctors, loading, currencySymbol } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  
  // Search and availability filters
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Run filters whenever dependencies change
  useEffect(() => {
    let tempDocs = [...doctors];

    // Filter by specialty parameter
    if (specialty) {
      tempDocs = tempDocs.filter(doc => doc.specialty.toLowerCase() === specialty.toLowerCase());
    }

    // Filter by name search
    if (searchQuery.trim() !== '') {
      tempDocs = tempDocs.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by availability checkbox
    if (onlyAvailable) {
      tempDocs = tempDocs.filter(doc => doc.availability === true);
    }

    setFilterDoc(tempDocs);
  }, [doctors, specialty, searchQuery, onlyAvailable]);

  const selectSpecialty = (name) => {
    if (specialty === name) {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${name}`);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 text-slate-800 dark:text-slate-200 py-6 min-h-screen animate-fadeIn'>
      <div className='flex flex-col gap-2 mb-6'>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>Browse Specialists</h2>
        <p className='text-xs text-slate-500 dark:text-slate-400'>
          Find doctors matching your symptoms, check fees, and book slots instantly.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className='flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm transition-colors duration-200 w-full'>
        {/* Search Input */}
        <div className='flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 w-full md:max-w-md'>
          <Search size={18} className='text-slate-400' />
          <input 
            type='text' 
            placeholder='Search doctor by name or specialty...' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-transparent outline-none w-full text-sm text-slate-800 dark:text-white'
          />
        </div>

        {/* Availability Switch */}
        <div className='flex items-center gap-6 justify-between w-full md:w-auto'>
          <label className='flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400'>
            <input 
              type='checkbox' 
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className='sr-only peer'
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
            <span>Show Only Available</span>
          </label>

          {/* Mobile Filter toggle */}
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className='md:hidden border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
          >
            Filters
          </button>
        </div>
      </div>

      {/* Main Listing Columns */}
      <div className='flex flex-col md:flex-row items-start gap-8'>
        {/* Left Side Filter Sidebar */}
        <div className={`md:flex flex-col gap-3 w-full md:w-64 flex-shrink-0 ${showFilter ? 'flex' : 'hidden'}`}>
          <h3 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 hidden md:block'>Specialities</h3>
          <div className='flex flex-col gap-2'>
            {specialties.map((item, index) => (
              <p
                key={index}
                onClick={() => selectSpecialty(item)}
                className={`px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-primary dark:hover:border-primary ${
                  specialty === item 
                    ? 'bg-primary text-white border-primary dark:border-primary shadow-sm' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Right Side Doctor Grid */}
        <div className='flex-1 w-full'>
          {loading ? (
            // Loading Skeletons
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map((skel) => (
                <div key={skel} className='border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-4 bg-white dark:bg-slate-900 animate-pulse'>
                  <div className='w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl'></div>
                  <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3'></div>
                  <div className='h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3'></div>
                  <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          ) : filterDoc.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filterDoc.map((item, index) => (
                <div
                  key={index}
                  onClick={() => { navigate(`/doctor/${item._id}`); window.scrollTo(0,0); }}
                  className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col'
                >
                  <div className='relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                    <img 
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                      src={item.image} 
                      alt={item.name} 
                    />
                    {item.rating > 0 && (
                      <div className='absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-850 dark:text-slate-150 border border-slate-100 dark:border-slate-800 shadow-sm'>
                        <Star size={12} className='text-yellow-400 fill-yellow-400' />
                        <span>{item.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className='p-5 flex flex-col flex-grow gap-2'>
                    <div className='flex items-center gap-2 text-xs'>
                      <span className={`w-2.5 h-2.5 rounded-full ${item.availability ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      <p className={item.availability ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 font-medium'}>
                        {item.availability ? 'Available' : 'Unavailable'}
                      </p>
                    </div>

                    <h3 className='font-bold text-base text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1'>
                      {item.name}
                    </h3>
                    
                    <p className='text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider'>
                      {item.specialty}
                    </p>

                    <div className='flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80'>
                      <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Fee</span>
                      <span className='text-sm font-bold text-slate-800 dark:text-white'>{currencySymbol}{item.fees}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results State
            <div className='flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-650 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 w-full shadow-sm'>
              <FilterX className='w-16 h-16 text-slate-300 mb-4' />
              <p className='text-lg font-bold text-slate-700 dark:text-slate-300'>No Doctors Found</p>
              <p className='text-sm max-w-xs text-center mt-1'>
                We couldn't find any doctor matching your filters. Try clearing search queries or selecting other specialties.
              </p>
              <button 
                onClick={() => { navigate('/doctors'); setSearchQuery(''); setOnlyAvailable(false); }} 
                className='mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/95 transition-all text-xs'
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
