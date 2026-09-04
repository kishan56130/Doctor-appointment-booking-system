import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Fetch doctor's appointments
  const getAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Complete appointment
  const completeAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard summary
  const getDashData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor profile details
  const getProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update doctor profile (fees, availability, about)
  const updateProfile = async (updateData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        toast.success(data.message);
        setProfileData(data.profileData);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfile();
    } else {
      setProfileData(false);
    }
  }, [dToken]);

  const value = {
    dToken,
    setDToken,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfile,
    updateProfile,
    loading,
    backendUrl
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
