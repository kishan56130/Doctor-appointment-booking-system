import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppContextProvider from './context/AppContext.jsx';
import AdminContextProvider from './context/AdminContext.jsx';
import DoctorContextProvider from './context/DoctorContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <AdminContextProvider>
        <DoctorContextProvider>
          <App />
        </DoctorContextProvider>
      </AdminContextProvider>
    </AppContextProvider>
  </StrictMode>,
);
