import React, { useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "./config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

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
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
        localStorage.setItem(cacheKey, JSON.stringify({ data: userData, timestamp: Date.now() }));
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const UserID = user.email.substring(0, 9);
        let Role = "";

        if (UserID === "220143805") {
          Role = "Admin";
        } else if (UserID.startsWith('7')) {
          Role = "Supervisor";
        } else if (UserID.startsWith('2')) {
          Role = "Student";
        } else if (user.email.endsWith('@externalexaminer.co.za')) {
          Role = "Examiner";
        } else {
          throw new Error("Invalid user type");
        }

        setUserRole(Role);
        setCurrentUser(user);
        setLoggedInUser(true);
        await fetchUserData(UserID, Role);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Handle error appropriately in the component
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        const UserID = email.substring(0, 9);
        let Role = "";

        if (email.startsWith('4')) {
          Role = "Admin";
        } else if (UserID.startsWith('7')) {
          Role = "Supervisor";
        } else if (UserID.startsWith('2')) {
          Role = "Student";
        } else if (email.startsWith('3')) {
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

    return unsubscribe;
  }, [fetchUserData]);

  const Value = {
    CurrentUser,
    LoggedInUser,
    Loading,
    UserRole,
    UserData,
    login, // Provide login function to the context
  };

  return (
    <AuthContext.Provider value={Value}>
      {!Loading && children}
    </AuthContext.Provider>
  );
}
