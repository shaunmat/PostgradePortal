import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Shared/Login';
import { PageRoutes } from './pages/PageRoutes';
import { ToastContainer } from 'react-toastify';
import { AdminDashboard } from './pages/AdminPages/AdminDashboard';
import { AdminSettings } from './pages/AdminPages/AdminSettings';
import {AdminPageRoutes} from './pages/AdminPages/AdminPageRoutes'

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const userRole = localStorage.getItem('userRole');
  console.log("this is the user role in the app js",userRole)

  return (
    <>
   
   <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {userRole === 'Admin' ? (
          <Route path="*/" element={<AdminPageRoutes />} />
        ) : (
          <Route path="/*" element={<PageRoutes />} />
        )}
      </Routes>
      <ToastContainer />
      <ToastContainer />
    </>
  );
}

export default App;
