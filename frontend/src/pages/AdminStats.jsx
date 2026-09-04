import { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { AppContext } from '../context/AppContext';
import { 
  Users, 
  UserCheck, 
  CalendarDays, 
  TrendingUp, 
  XCircle, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

const AdminStats = () => {
  const { dashData, getDashData, cancelAppointment, loading } = useContext(AdminContext);
  const { currencySymbol } = useContext(AppContext);

  useEffect(() => {
    getDashData();
  }, []);

  if (!dashData && loading) {
    return (
      <div className='flex items-center justify-center py-20 text-slate-500'>
        <p>Calculating dashboard data aggregates...</p>
      </div>
    );
  }

  if (!dashData) {
    return (
      <div className='flex items-center justify-center py-20 text-slate-500'>
        <p>No dashboard metrics gathered yet.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8 animate-fadeIn w-full'>
      {/* Page Header */}
      <div>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-white'>Workspace Overview</h2>
        <p className='text-xs text-slate-500 dark:text-slate-400'>
          Real-time aggregates of medical practitioners, patient accounts, booking volume, and gross billing.
        </p>
      </div>

      {/* Aggregate Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Total Doctors */}
        <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm transition-colors duration-200'>
          <div className='w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-primary flex items-center justify-center'>
            <UserCheck size={26} />
          </div>
          <div>
            <p className='text-2xl font-extrabold text-slate-800 dark:text-white'>{dashData.doctors}</p>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5'>Active Doctors</p>
          </div>
        </div>

        {/* Total Patients */}
        <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm transition-colors duration-200'>
          <div className='w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center'>
            <Users size={26} />
          </div>
          <div>
            <p className='text-2xl font-extrabold text-slate-800 dark:text-white'>{dashData.patients}</p>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5'>Total Patients</p>
          </div>
        </div>

        {/* Total Appointments */}
        <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm transition-colors duration-200'>
          <div className='w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center'>
            <CalendarDays size={26} />
          </div>
          <div>
            <p className='text-2xl font-extrabold text-slate-800 dark:text-white'>{dashData.appointments}</p>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5'>Appointments Booked</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm transition-colors duration-200'>
          <div className='w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center'>
            <TrendingUp size={26} />
          </div>
          <div>
            <p className='text-2xl font-extrabold text-slate-800 dark:text-white'>{currencySymbol}{dashData.revenue}</p>
            <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5'>Gross Revenue</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Table */}
      <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200'>
        <h3 className='font-bold text-slate-800 dark:text-white text-lg mb-6'>Latest Consult Bookings</h3>
        
        <div className='overflow-x-auto w-full'>
          <table className='w-full text-left text-sm border-collapse'>
            <thead>
              <tr className='border-b border-slate-100 dark:border-slate-800/80 pb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider'>
                <th className='pb-3 pl-2'>Doctor</th>
                <th className='pb-3'>Patient</th>
                <th className='pb-3'>Date & Time</th>
                <th className='pb-3'>Fee</th>
                <th className='pb-3 text-right pr-2'>Actions / Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/50'>
              {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((item, index) => (
                  <tr key={index} className='hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors'>
                    <td className='py-4 pl-2 flex items-center gap-3'>
                      <img className='w-9 h-9 rounded-full object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0' src={item.doctorData?.image} alt={item.doctorData?.name} />
                      <span className='font-bold text-slate-800 dark:text-white text-sm'>{item.doctorData?.name}</span>
                    </td>
                    <td className='py-4 font-medium text-slate-600 dark:text-slate-350'>{item.patientData?.name}</td>
                    <td className='py-4 text-xs text-slate-500 dark:text-slate-450'>
                      <p className='font-medium'>{item.appointmentDate}</p>
                      <p className='text-[10px] mt-0.5'>{item.appointmentTime.toLowerCase()}</p>
                    </td>
                    <td className='py-4 font-bold text-slate-800 dark:text-white'>{currencySymbol}{item.amount}</td>
                    <td className='py-4 text-right pr-2'>
                      {item.status === 'cancelled' ? (
                        <span className='inline-flex items-center gap-1 text-red-500 text-xs font-semibold px-2.5 py-1 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30'>
                          <XCircle size={12} /> Cancelled
                        </span>
                      ) : item.status === 'completed' ? (
                        <span className='inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30'>
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      ) : (
                        <div className='flex items-center justify-end gap-2'>
                          <span className='inline-flex items-center gap-1 text-blue-600 text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30 mr-2'>
                            <Clock size={12} /> Pending
                          </span>
                          <button 
                            onClick={() => cancelAppointment(item._id)}
                            className='text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-lg transition-colors'
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='text-center py-10 text-slate-500 font-light'>No recent appointments available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
