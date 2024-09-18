import { useAuth } from './backend/authcontext';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Login } from '../src/components/Shared/Login';
import {AdminPageRoutes} from '../src/pages/adminPages/AdminPageRoutes'
import { PageRoutes } from './pages/PageRoutes';
import { LogoLoader } from './components/LogoLoader';
import { AuthProvider } from './backend/authcontext';
function App() {
  const {CurrentUser,LoggedInUser,Loading}=useAuth()||{};
  const [userType,setUserType]=useState('')
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

  useEffect(()=>{
    if(!Loading && CurrentUser){
      const email=CurrentUser.email||'';
      const userType = email== "220143805@uj.ac.za"?'Admin': email.startsWith('7') ? 'Supervisor' : email.startsWith('2') ? 'Student':'';
      setUserType(userType);
      console.log(email +"Is the current user from the the database")
      console.log(userType)
    }
  },[CurrentUser,Loading]);
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Conditionally render AdminPageRoutes or PageRoutes based on userType */}
        {userType === 'Admin' ? (
          <Route path="/*" element={<AdminPageRoutes />} />
        ) : (
          <Route path="/*" element={<PageRoutes />} />
        )}

        {/* Redirect to login if userType is not set */}
        {userType === '' && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </AuthProvider>
  );
}

export default App;
