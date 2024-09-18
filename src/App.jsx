import { useAuth } from './backend/authcontext';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Login } from '../src/components/Shared/Login';
import { PageRoutes } from './pages/PageRoutes';
import {AdminDashboard} from '../src/pages/adminPages/AdminPageRoutes';
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
      const userType = email.startsWith('7') ? 'Supervisor' : email.startsWith('2') ? 'Student'?'Admin':email=="220143805@uj.ac.za":'';
      console.log(CurrentUser +"Is the current user from the the database")
    }
  },[CurrentUser,Loading]);
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
