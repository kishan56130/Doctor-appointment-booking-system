import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Patient Facing Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import DoctorDetails from './pages/DoctorDetails';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminStats from './pages/AdminStats';
import AddDoctor from './pages/AddDoctor';
import DoctorsList from './pages/DoctorsList';
import AdminAppointments from './pages/AdminAppointments';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './pages/AdminProfile';

// Doctor Dashboard Pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorStats from './pages/DoctorStats';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorProfileSettings from './pages/DoctorProfileSettings';
import DoctorLogin from './pages/DoctorLogin';

// Patient Layout Wrapper
const PatientLayout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200'>
      <Navbar />
      <main className='flex-grow px-2 md:px-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification Provider */}
      <ToastContainer 
        position='top-right' 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme='colored'
      />

      <Routes>
        {/* Patient Public & Auth Routes */}
        <Route element={<PatientLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:specialty' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/doctor-login' element={<DoctorLogin />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/doctor/:docId' element={<DoctorDetails />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
        </Route>

        {/* Secure Admin Dashboard Panel */}
        <Route path='/admin-dashboard' element={<AdminDashboard />}>
          <Route index element={<AdminStats />} />
          <Route path='dashboard' element={<AdminStats />} />
          <Route path='add-doctor' element={<AddDoctor />} />
          <Route path='doctors-list' element={<DoctorsList />} />
          <Route path='appointments' element={<AdminAppointments />} />
          <Route path='profile' element={<AdminProfile />} />
        </Route>

        {/* Secure Doctor Dashboard Panel */}
        <Route path='/doctor-dashboard' element={<DoctorDashboard />}>
          <Route index element={<DoctorStats />} />
          <Route path='dashboard' element={<DoctorStats />} />
          <Route path='appointments' element={<DoctorAppointments />} />
          <Route path='profile' element={<DoctorProfileSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
