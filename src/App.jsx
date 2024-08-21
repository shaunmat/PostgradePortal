import { useAuth } from './backend/AuthContext';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Login } from '../src/components/Shared/Login';
import { PageRoutes } from './pages/PageRoutes';
import { LogoLoader } from './components/LogoLoader';
import { AuthProvider } from './backend/AuthContext';
function App() {
  const {CurrentUser,LoggedInUser,Loading}=useAuth()||{};

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

  // if (loading) {
  //   return <LogoLoader />;
  // }
  const email = CurrentUser?.email || '' ;
  const userType = email.startsWith('7') ? 'Supervisor' : email.startsWith('2') ? 'Student':'';

  console.log(userType +"Is the current user from the the database!!!!!");
  return (
    <AuthProvider>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<PageRoutes />} />
      {/* Redirect based on userType */}
      {userType === '' && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </AuthProvider> 
  );
}

export default App;
