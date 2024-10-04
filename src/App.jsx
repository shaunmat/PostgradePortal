import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Shared/Login';
import { PageRoutes } from './pages/PageRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { memo, useCallback } from 'react';

// Memoize the ToastContainer to prevent unnecessary re-renders
const MemoizedToastContainer = memo(ToastContainer);

function App() {
  // Memoize the routes to prevent unnecessary re-renders
  const renderRoutes = useCallback(() => (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<PageRoutes />} />
    </Routes>
  ), []);

  return (
    <>
      {renderRoutes()}
      <MemoizedToastContainer />
    </>
  );
}

export default memo(App);