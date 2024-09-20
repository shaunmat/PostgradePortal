import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Login } from './pages/shared/Login';
import { PageRoutes } from './pages/PageRoutes';

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart(); // Start loading when the location changes

    const timer = setTimeout(() => {
      handleComplete();
    }, 1000); // Adjust the duration as needed for the loader

    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    // return <LogoLoader />;
  }

  return (
    <Routes>
      {/* Redirect from the root path to /login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<PageRoutes />} />
    </Routes>
  );
}

export default App;
