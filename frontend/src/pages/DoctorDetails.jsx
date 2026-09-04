import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RatingStars from '../components/RatingStars';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  CalendarDays, 
  Coins, 
  GraduationCap, 
  Briefcase, 
  Clock,
  Sparkles
} from 'lucide-react';

const DoctorDetails = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, currencySymbol, token, backendUrl, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [relatedDocs, setRelatedDocs] = useState([]);



  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getAvailableSlots = async () => {
    if (!docInfo) return;

    let today = new Date();
    let tempSlots = [];

    for (let i = 0; i < 7; i++) {
      // Calculate date object for rolling 7 days
      let currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      // Set slot end hour to 4:00 PM (16:00)
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(16, 0, 0, 0);

      // Set slot start hour: If today, start at 10 AM or upcoming hour, otherwise 10:00 AM
      if (today.getDate() === currentDate.getDate()) {
        if (currentDate.getHours() < 10) {
          currentDate.setHours(10, 0, 0, 0);
        } else {
          currentDate.setHours(currentDate.getHours() + 1, 0, 0, 0);
        }
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
      }

      let timeSlots = [];

      while (currentDate <= endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let slotDate = `${day}_${month}_${year}`;

        // Check if the slot is already booked in the database
        const isBooked = docInfo.slotsBooked && docInfo.slotsBooked[slotDate] && docInfo.slotsBooked[slotDate].includes(formattedTime);

        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }

        // Increment time by 1 hour (60 minutes)
        currentDate.setHours(currentDate.getHours() + 1);
      }

      tempSlots.push(timeSlots);
    }

    setDocSlots(tempSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Please login to book appointment');
      navigate('/login');
      return;
    }

    if (!slotTime) {
      toast.warning('Please select a time slot');
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData(); // Reload doctors list to update availability slotsBooked
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };



  useEffect(() => {
    // Find doctor info
    const doc = doctors.find(item => item._id === docId);
    setDocInfo(doc || null);
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
      // Filter related doctors (same specialty, excluding current doctor, and must be available)
      const related = doctors.filter(doc => doc.specialty === docInfo.specialty && doc._id !== docInfo._id && doc.availability === true);
      setRelatedDocs(related);
    }
  }, [docInfo, doctors]);

  if (!docInfo) {
    return (
      <div className='flex items-center justify-center min-h-[60vh] text-slate-500'>
        <p>Loading doctor profile details...</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 text-slate-800 dark:text-slate-200 py-6 animate-fadeIn'>
      {/* Doctor Info card */}
      <div className='flex flex-col sm:flex-row gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200'>
        {/* Doctor Photo */}
        <div className='w-full sm:w-64 md:w-72 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 flex items-center justify-center shadow-sm'>
          <img className='w-full h-auto object-cover max-h-[360px]' src={docInfo.image} alt={docInfo.name} />
        </div>

        {/* Accolades details */}
        <div className='flex-1 flex flex-col gap-4'>
          <div>
            <div className='mb-1.5'>
              <div>
                <div className='flex items-center gap-3'>
                  <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>{docInfo.name}</h2>
                  {docInfo.availability && (
                    <span className='px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30'>Verified</span>
                  )}
                </div>
                
                <div className='flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1.5'>
                  <span className='flex items-center gap-1.5'><GraduationCap size={16} /> {docInfo.degree}</span>
                  <span className='flex items-center gap-1.5'><Briefcase size={15} /> {docInfo.experience}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 mt-1.5'>
            <RatingStars rating={docInfo.rating || 0} size={18} />
            <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>({docInfo.reviews?.length || 0} reviews)</span>
          </div>

          <hr className='border-slate-100 dark:border-slate-800/80 my-1' />

          <div>
            <h3 className='font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider mb-2'>About Doctor</h3>
            <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl font-light'>{docInfo.about}</p>
          </div>

          <div className='flex items-center gap-2 mt-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 w-fit'>
            <Coins size={18} className='text-slate-400' />
            <span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>Consultation fee:</span>
            <span className='text-base font-bold text-slate-800 dark:text-white'>{currencySymbol}{docInfo.fees}</span>
          </div>
        </div>
      </div>

      {/* Booking Calendar module */}
      <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mt-8 shadow-sm transition-colors duration-200'>
        <h3 className='font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2'>
          <CalendarDays className='w-5 h-5 text-primary' /> Schedule Consultation
        </h3>

        {/* Rolling 7 Days headers */}
        <div className='flex gap-3 overflow-x-auto pb-4 scrollbar-none'>
          {docSlots.length > 0 && docSlots.map((item, index) => {
            if (item.length === 0) return null;
            return (
              <div
                key={index}
                onClick={() => { setSlotIndex(index); setSlotTime(''); }}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-4 min-w-[70px] rounded-2xl cursor-pointer border transition-all duration-200 ${
                  slotIndex === index
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/25 hover:bg-primary'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <p className='text-xs font-semibold'>{daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className='text-lg font-bold mt-1'>{item[0].datetime.getDate()}</p>
              </div>
            );
          })}
        </div>

        {/* Slot times selectors */}
        <div className='flex flex-wrap gap-2.5 mt-6'>
          {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <button
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all duration-150 ${
                  item.time === slotTime
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Clock size={12} />
                <span>{item.time.toLowerCase()}</span>
              </button>
            ))
          ) : (
            <p className='text-sm text-slate-500 py-3'>No slots available on this date. Please select another day.</p>
          )}
        </div>

        {/* Submit Booking */}
        {docInfo.availability ? (
          <button
            onClick={bookAppointment}
            className='bg-primary hover:bg-primary/95 text-white px-10 py-3.5 rounded-xl font-bold shadow-md shadow-primary/10 transition-all duration-300 active:scale-95 text-sm mt-8'
          >
            Book Appointment
          </button>
        ) : (
          <div className='bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl mt-8 font-semibold w-fit'>
            Doctor is temporarily unavailable. Check back later.
          </div>
        )}
      </div>

      {/* Related Doctors Section */}
      <div className='flex flex-col items-center gap-4 my-16 text-slate-900 dark:text-slate-100 px-4 md:px-0'>
        <h2 className='text-3xl font-bold tracking-tight text-center'>Related Doctors</h2>
        <p className='sm:w-1/3 text-center text-sm text-slate-500 dark:text-slate-400'>
          Simply browse through our list of doctors to book your appointment.
        </p>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-10 px-2 max-w-7xl mx-auto justify-center'>
          {relatedDocs.slice(0, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => { navigate(`/doctor/${item._id}`); window.scrollTo(0,0); }}
              className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md group flex flex-col'
            >
              {/* Image section */}
              <div className='relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                <img 
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                  src={item.image} 
                  alt={item.name} 
                />
              </div>

              {/* Details section */}
              <div className='p-5 flex flex-col flex-grow gap-2'>
                {/* Availability Status */}
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
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default DoctorDetails;
