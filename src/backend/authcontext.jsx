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
    try {
      const userRef = doc(db, UserRole, UserID);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    const ClearStates = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        const UserID = email.substring(0, 9); 
        let Role = "";
        
        if (UserID.startsWith('7')) {
          Role = "Supervisor";
        } else if (UserID.startsWith('2')) {
          Role = "Student";
        } else {
          alert("Invalid user type");
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
    UserData
  };

  return (
    <AuthContext.Provider value={Value}>
      {!Loading && children}
    </AuthContext.Provider>
  );
}
