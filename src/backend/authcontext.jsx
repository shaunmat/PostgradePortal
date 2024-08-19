import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "./config";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [CurrentUser, setCurrentUser] = useState(null);
  const [LoggedInUser, setLoggedInUser] = useState(false);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const ClearStates = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoggedInUser(true);
      } else {
        setCurrentUser(null);
        setLoggedInUser(false);
      }
      setLoading(false);
    });

    return ClearStates;
  }, []);

  const Value = {
    CurrentUser,
    LoggedInUser,
    Loading,
  };

  return (
    <AuthContext.Provider value={Value}>
      {!Loading && children}
    </AuthContext.Provider>
  );
}