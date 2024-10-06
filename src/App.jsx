import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Shared/Login';
import { PageRoutes } from './pages/PageRoutes';
import { ToastContainer } from 'react-toastify';
import { AdminPageRoutes } from './pages/AdminPages/AdminPageRoutes';
import { ForgotPassword } from './components/Shared/ForgotPassword';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
          {userRole === 'Admin' ? (
            <Route path="/admin/*" element={<AdminPageRoutes />} />
          ) : (
            <Route path="/*" element={<PageRoutes />} />
          )}
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
