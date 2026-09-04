import { useContext, useEffect } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { 
  CalendarDays, 
  XCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const DoctorAppointments = () => {
  const { appointments, getAppointments, completeAppointment, cancelAppointment, loading } = useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div className='flex flex-col gap-6 animate-fadeIn w-full'>
      {/* Page Header */}
      <div>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2'>
          <CalendarDays size={24} className='text-primary' /> Consult Bookings List
        </h2>
        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
          Manage your patients' appointments, toggle diagnostic visit completions, or cancel schedules.
        </p>
      </div>

      {loading && appointments.length === 0 ? (
        <div className='flex justify-center items-center py-20 text-slate-500'>
          <p>Retrieving scheduled consults...</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-200 overflow-x-auto w-full'>
          <table className='w-full text-left text-sm border-collapse min-w-[700px]'>
            <thead>
              <tr className='border-b border-slate-100 dark:border-slate-800/80 pb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider'>
                <th className='pb-3 pl-2'>Patient</th>
                <th className='pb-3'>Scheduled Date/Time</th>
                <th className='pb-3'>Consult Fee</th>
                <th className='pb-3 text-right pr-2'>Status Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/50'>
              {appointments.map((item, index) => (
                <tr key={index} className='hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors'>
                  <td className='py-4 pl-2'>
                    <span className='font-bold text-slate-800 dark:text-white'>{item.patientData?.name}</span>
                    <p className='text-[10px] text-slate-400 mt-0.5'>Phone: {item.patientData?.phone} | {item.patientData?.gender}</p>
                  </td>
                  <td className='py-4 text-xs text-slate-500 dark:text-slate-450'>
                    <p className='font-semibold'>{item.appointmentDate}</p>
                    <p className='text-[10px] mt-0.5'>{item.appointmentTime.toLowerCase()}</p>
                  </td>
                  <td className='py-4'>
                    <span className='font-bold text-slate-800 dark:text-white text-xs'>{currencySymbol}{item.amount}</span>
                    <p className={`text-[9px] font-bold mt-1 uppercase tracking-wide ${item.paymentStatus === 'paid' ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </p>
                  </td>
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
                      <div className='flex items-center justify-end gap-2.5'>
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className='text-xs font-bold text-white bg-primary hover:bg-primary/95 px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-primary/10 active:scale-95'
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className='text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 px-3.5 py-2 rounded-xl transition-colors'
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Empty State
        <div className='flex flex-col items-center justify-center py-20 text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 w-full shadow-sm'>
          <p className='text-lg font-bold text-slate-750 dark:text-slate-300'>No Appointments Booked</p>
          <p className='text-sm max-w-xs text-center mt-1'>There are currently no scheduled appointments in your logs.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
