import React, { useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "./config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [CurrentUser, setCurrentUser] = useState(null);
  const [LoggedInUser, setLoggedInUser] = useState(false);
  const [UserData, setUserData] = useState(null);
  const [UserRole, setUserRole] = useState(null);
  const [Loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (UserID, UserRole) => {
    const cacheKey = `${UserRole}-${UserID}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 1 day expiration

      if (!isExpired) {
        setUserData(data);
        return;
      }
    }

    try {

      const userRef = doc(db, UserRole, UserID);
      const docSnap = await getDoc(userRef);
        console.log(UserRole,"This is the user role in the beginning of the try and catch")
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
        
        // Cache the fetched data with a timestamp
        localStorage.setItem(cacheKey, JSON.stringify({ data: userData, timestamp: Date.now() }));
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Optional: Add user feedback here
    }
  }, []);

  useEffect(() => {
    const ClearStates = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        const UserID = email.substring(0, 9);
        console.log("If statement for the role here is the ID number",UserID)
        let Role = "";
        if(UserID=="220143805"){
          Role="Admin";
        }
        else if (UserID.startsWith('7')) {
          Role = "Supervisor";
        } else if (UserID.startsWith('2')) {
          Role = "Student";
        } else if (email.endsWith('@externalexaminer.co.za')) {
          Role = "Examiner";
        } else {
          alert("Invalid user type");
          return; // Exit if invalid user
        }

        setUserRole(Role);
        setCurrentUser(user);
        setLoggedInUser(true);

        await fetchUserData(UserID, Role);
      } else {
        setCurrentUser(null);
        setLoggedInUser(false);
        setUserRole("");
        setUserData(null);
      }
      setLoading(false);
    });

    return ClearStates;
  }, [fetchUserData]);

  const Value = {
    CurrentUser,
    LoggedInUser,
    Loading,
    UserRole,
    UserData,
  };

  return (
    <AuthContext.Provider value={Value}>
      {!Loading && children}
    </AuthContext.Provider>
  );
}
