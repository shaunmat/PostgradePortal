import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Shared/Login';
import { PageRoutes } from './pages/PageRoutes';
import { ToastContainer } from 'react-toastify';
import { ForgotPassword } from './components/Shared/ForgotPassword';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<PageRoutes />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;