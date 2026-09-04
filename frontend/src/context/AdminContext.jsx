import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(sessionStorage.getItem('aToken') || '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Fetch all doctors for admin
  const getAllDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        setDoctors(data.doctors);
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

  // Toggle Doctor Availability
  const changeAvailability = async (docId, currentStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/edit-doctor`,
        { docId, availability: !currentStatus },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success("Availability updated successfully");
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Add new doctor
  const addDoctor = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
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

  // Edit doctor profile
  const updateDoctor = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/edit-doctor`, formData, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
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

  // Delete doctor
  const deleteDoctor = async (docId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-doctor`,
        { docId },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
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

  // Fetch all bookings log
  const getAllAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { atoken: aToken }
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

  // Admin cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
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

  // Get Admin statistics
  const getDashData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { atoken: aToken }
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

  // Get Admin profile details
  const getAdminProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/profile`, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        setAdminData(data.admin);
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

  // Update Admin profile details
  const updateAdminProfile = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/update-profile`, formData, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success(data.message);
        setAdminData(data.admin);
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
    if (aToken) {
      getAdminProfile();
    } else {
      setAdminData(false);
    }
  }, [aToken]);

  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    loading,
    backendUrl,
    adminData,
    setAdminData,
    getAdminProfile,
    updateAdminProfile
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
